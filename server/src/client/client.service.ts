import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientGateway } from './client.gateway';
import { Client } from './entities/client.entity';
import { CreateFileDto, SendCommandDto } from './dto/client.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as fse from 'fs-extra';
import { Role } from '@prisma/client';

@Injectable()
export class ClientService {
  constructor(
    private prisma: PrismaService,
    private clientGateway: ClientGateway,
  ) {}

  public readonly uploadPath = path.join(__dirname, '../../uploads');
  public readonly downloadPath = path.join(__dirname, '../../downloads');
  public readonly maxFileSize = 2 * 1024 * 1024 * 1024;
  public readonly massDownloadZipName = 'download.zip';

  private getMaxClientsByRole(role: Role): number {
    switch (role) {
      case Role.PREMIUM:
        return 10;
      case Role.VIP:
        return 50;
      case Role.USER:
      default:
        return 1;
    }
  }

  async getClientsByUserId(userId: number) {
    return this.prisma.client.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async destroyConnection(hwid: string, userId: number) {
    const client = await this.prisma.client.findUnique({
      where: {
        hwid: hwid,
        userId: userId,
      },
    });

    if (!client) throw new ConflictException('Client not found');

    return this.clientGateway.destroyConnection(client.hwid);
  }

  async registerClient(data: Client) {
    const user = await this.prisma.clientKey.findUnique({
      where: {
        key: data.clientKey,
      },
      include: {
        user: {
          include: {
            clients: true,
          },
        },
      },
    });

    if (!user) {
      console.warn(`⚠️ Invalid client key: ${data.clientKey}`);
      return null;
    }

    const existingClient = await this.prisma.client.findUnique({
      where: {
        hwid: data.hwid,
      },
    });

    if (!existingClient) {
      const clientCount = user.user.clients.length;
      const maxClients = this.getMaxClientsByRole(user.user.role);

      if (clientCount >= maxClients) {
        console.warn(
          `⚠️ Client limit reached for user ${user.user.id} (Role: ${user.user.role})`,
        );
        return null;
      }
    }

    return this.prisma.client.upsert({
      where: {
        hwid: data.hwid,
      },
      update: {
        ip: data.ip,
        os: data.os,
        hostname: data.hostname,
        username: data.username,
        online: true,
      },
      create: {
        hwid: data.hwid,
        ip: data.ip,
        os: data.os,
        hostname: data.hostname,
        username: data.username,
        userId: user.userId,
        online: true,
      },
    });
  }

  async updateClientStatus(hwid: string, online: boolean) {
    await this.prisma.client.update({
      where: {
        hwid: hwid,
      },
      data: {
        online: online,
      },
    });
  }

  async sendCommandToClient(
    hwid: string,
    userId: number,
    dto: SendCommandDto,
    callback: (response: string) => void,
  ) {
    const client = await this.prisma.client.findUnique({
      where: {
        hwid: hwid,
        userId: userId,
      },
    });

    if (!client) throw new ConflictException('Client not found');

    return this.clientGateway.sendCommandToClient(
      client,
      dto.command,
      callback,
    );
  }

  async uploadFileToClient(
    hwid: string,
    userId: number,
    files: Express.Multer.File[],
    destination: string,
  ) {
    const client = await this.prisma.client.findUnique({
      where: {
        hwid: hwid,
        userId: userId,
      },
    });

    if (!client) throw new ConflictException('Client not found');

    if (!files || files.length === 0)
      throw new ConflictException('No files uploaded');
    files.forEach((file) => {
      if (file.size > this.maxFileSize) {
        throw new ConflictException('One or more files are too large');
      }
    });

    try {
      await fse.ensureDir(this.uploadPath);

      const uploadedFiles = [];
      const uploadResults = [];

      for (const file of files) {
        const safeFilename = path
          .basename(file.originalname)
          .replace(/[^a-zA-Z0-9._-]/g, '_');

        const filePath = path.resolve(this.uploadPath, safeFilename);
        if (!filePath.startsWith(this.uploadPath)) {
          throw new ConflictException('Invalid file path detected');
        }

        await fse.writeFile(filePath, file.buffer);
        uploadedFiles.push(safeFilename);
      }

      //Send the files to the client
      for (const filename of uploadedFiles) {
        try {
          const result = (await this.clientGateway.uploadFileToClient(
            client,
            filename,
            destination,
          )) as { message: string };
          uploadResults.push(result.message);
        } catch (error) {
          console.error('Error sending file to client:', error.message);
          uploadResults.push(`Failed to upload ${filename}: ${error.message}`);
        }
      }

      // Delete the files from the server after sending them to the client
      uploadedFiles.forEach(async (filename) => {
        const filePath = path.join(this.uploadPath, filename);
        try {
          await fs.promises.unlink(filePath);
        } catch (error) {
          console.error(`Failed to delete file ${filename}`, error);
        }
      });

      return {
        message: uploadResults.join(', '),
        filenames: uploadedFiles,
      };
    } catch (error) {
      throw new ConflictException(
        error.response.message || 'File upload failed',
      );
    }
  }

  async downloadFileFromClient(
    hwid: string,
    userId: number,
    filePath: string,
    filename: string,
  ) {
    const client = await this.prisma.client.findUnique({
      where: {
        hwid: hwid,
        userId: userId,
      },
    });

    if (!client) throw new ConflictException('Client not found');

    return this.clientGateway.downloadFileFromClient(
      client,
      filePath,
      filename,
    );
  }

  async createFile(
    hwid: string,
    userId: number,
    filePath: string,
    dto: CreateFileDto,
  ) {
    const client = await this.prisma.client.findUnique({
      where: {
        hwid: hwid,
        userId: userId,
      },
    });

    if (!client) throw new ConflictException('Client not found');

    return this.clientGateway.createFile(client, filePath, dto.content);
  }

  async readFile(hwid: string, userId: number, filePath: string) {
    const client = await this.prisma.client.findUnique({
      where: {
        hwid: hwid,
        userId: userId,
      },
    });

    if (!client) throw new ConflictException('Client not found');

    return this.clientGateway.readFile(client, filePath);
  }

  async updateFile(
    hwid: string,
    userId: number,
    filePath: string,
    dto: CreateFileDto,
  ) {
    const client = await this.prisma.client.findUnique({
      where: {
        hwid: hwid,
        userId: userId,
      },
    });

    if (!client) throw new ConflictException('Client not found');

    return this.clientGateway.updateFile(client, filePath, dto.content);
  }

  async deleteFile(hwid: string, userId: number, filePath: string) {
    const client = await this.prisma.client.findUnique({
      where: {
        hwid: hwid,
        userId: userId,
      },
    });

    if (!client) throw new ConflictException('Client not found');

    return this.clientGateway.deleteFile(client, filePath);
  }
}
