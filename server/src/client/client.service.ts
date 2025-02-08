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
  private readonly maxFileSize = 2 * 1024 * 1024 * 1024;

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
    file: Express.Multer.File,
  ) {
    const client = await this.prisma.client.findUnique({
      where: {
        hwid: hwid,
        userId: userId,
      },
    });

    if (!client) throw new ConflictException('Client not found');
    if (!file) throw new ConflictException('No file uploaded');
    if (file.size > this.maxFileSize)
      throw new ConflictException('File is too large');

    try {
      await fse.ensureDir(this.uploadPath);

      const safeFilename = path
        .basename(file.originalname)
        .replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = path.join(this.uploadPath, safeFilename);

      await fse.writeFile(filePath, file.buffer);

      this.clientGateway.uploadFileToClient(client, safeFilename);
      return { message: 'Upload erfolgreich!', filename: safeFilename };
    } catch (error) {
      console.log(error);
      throw new ConflictException('File upload failed');
    }
  }

  async downloadFileFromClient(hwid: string, userId: number, filename: string) {
    const client = await this.prisma.client.findUnique({
      where: {
        hwid: hwid,
        userId: userId,
      },
    });

    if (!client) throw new ConflictException('Client not found');

    try {
      await fse.ensureDir(this.downloadPath);

      const filePath = path.join(this.downloadPath, filename);
      const file = fs.createWriteStream(filePath);

      return file;
    } catch (error) {
      console.log(error);
      throw new ConflictException('File download failed');
    }
  }
}
