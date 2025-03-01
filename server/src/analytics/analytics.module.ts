import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService, JwtService, PrismaService],
})
export class AnalyticsModule {}
