import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async getClientsByUserId(userId: number) {
    return this.prisma.client.findMany({
      where: {
        userId: userId,
      },
    });
  }

  async sendCommandToClient(clientId: number, userId: number, command: string) {
    const client = await this.prisma.client.findUnique({
      where: {
        id: clientId,
        userId: userId,
      },
    });

    if (!client) throw new ConflictException('Client not found');

    //Send command TODO
  }
}
