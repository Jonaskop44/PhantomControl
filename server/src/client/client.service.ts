import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientGateway } from './client.gateway';
import { Client } from './entities/client.entity';
import { SendCommandDto } from './dto/client.dto';

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

  async sendCommandToClient(hwid: string, userId: number, dto: SendCommandDto) {
    const client = await this.prisma.client.findUnique({
      where: {
        hwid: hwid,
        userId: userId,
      },
    });

    if (!client) throw new ConflictException('Client not found');

    return this.clientGateway.sendCommandToClient(client, dto.command);
  }
}
