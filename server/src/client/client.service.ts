import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientGateway } from './client.gateway';
import { Client } from './entities/client.entity';
import { SendCommandDto } from './dto/client.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as fse from 'fs-extra';

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

  async getClientsByUserId(userId: number) {
    return this.prisma.client.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async destroyConnection(hwid: string, userId: number) {
    const client = await this.prisma.client.findFirst({
      where: {
        hwid: hwid,
        userId: userId,
      },
    });

    if (!client) throw new ConflictException('Client not found');

    return this.clientGateway.destroyConnection(client.hwid);
  }

  async registerClient(data: Client) {
    return this.prisma.client.upsert({
      where: {
        hwid: data.hwid,
      },
      update: {
        ip: data.ip,
        os: data.os,
        online: true,
      },
      create: {
        hwid: data.hwid,
        ip: data.ip,
        os: data.os,
        online: true,
        userId: 1,
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
      for (const file of files) {
        const safeFilename = path
          .basename(file.originalname)
          .replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = path.join(this.uploadPath, safeFilename);
        await fse.writeFile(filePath, file.buffer);
        uploadedFiles.push(safeFilename);
      }

      //Send the files to the client
      uploadedFiles.forEach((filename) => {
        this.clientGateway.uploadFileToClient(client, filename);
      });

      // Delete the files from the server after sending them to the client
      uploadedFiles.forEach((filename) => {
        const filePath = path.join(this.uploadPath, filename);
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.error(`Failed to delete file ${filename}`, error);
        }
      });

      return {
        message: 'Files uploaded successfully',
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
}
