import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getUserKpi(userId: number) {
    const clientsCount = await this.prisma.client.count({
      where: {
        userId: userId,
      },
    });

    const consolesCount = await this.prisma.console.count({
      where: {
        client: {
          userId: userId,
        },
      },
    });

    const fileExplorersCount = await this.prisma.fileExplorer.count({
      where: {
        client: {
          userId: userId,
        },
      },
    });

    const currentDate = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    const pastClientsCount = await this.prisma.client.count({
      where: {
        userId,
        createdAt: { lt: thirtyDaysAgo },
      },
    });

    console.log('clientsCount', clientsCount);
    console.log('pastClientsCount', pastClientsCount);

    const change = pastClientsCount
      ? ((clientsCount - pastClientsCount) / pastClientsCount) * 100
      : 0;

    return {
      clientsCount,
      change: change.toFixed(2) + '%',
      changeType: change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral',
      consolesCount,
      fileExplorersCount,
    };
  }
}
