import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ClientController],
  providers: [ClientService, JwtService, PrismaService],
})
export class ClientModule {}
