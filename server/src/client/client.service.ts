import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientGateway } from './client.gateway';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
  constructor(
    private prisma: PrismaService,
    private clientGateway: ClientGateway,
  ) {}

  async getClientsByUserId(userId: number) {
    return this.prisma.client.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async sendCommandToClient(hwid: string, userId: number, command: string) {
    const client = await this.prisma.client.findFirst({
      where: {
        hwid: hwid,
        userId: userId,
      },
    });

    if (!client) throw new ConflictException('Client not found');

    return this.clientGateway.sendCommandToClient(client, command);
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
}
