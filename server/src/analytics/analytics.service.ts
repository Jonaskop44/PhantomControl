import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getUserKpi(userId: number) {
    const clientsCount = await this.prisma.client.count({ where: { userId } });
    const consolesCount = await this.prisma.console.count({
      where: { client: { userId } },
    });
    const fileExplorersCount = await this.prisma.fileExplorer.count({
      where: { client: { userId } },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldClientsCount = await this.prisma.client.count({
      where: { userId, createdAt: { lt: thirtyDaysAgo } },
    });
    const oldConsolesCount = await this.prisma.console.count({
      where: { client: { userId }, createdAt: { lt: thirtyDaysAgo } },
    });
    const oldFileExplorersCount = await this.prisma.fileExplorer.count({
      where: { client: { userId }, createdAt: { lt: thirtyDaysAgo } },
    });

    const getChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const getChangeType = (change: number) => {
      return change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
    };

    return {
      clientsCount: {
        value: clientsCount,
        change: getChange(clientsCount, oldClientsCount),
        changeType: getChangeType(getChange(clientsCount, oldClientsCount)),
      },
      consolesCount: {
        value: consolesCount,
        change: getChange(consolesCount, oldConsolesCount),
        changeType: getChangeType(getChange(consolesCount, oldConsolesCount)),
      },
      fileExplorersCount: {
        value: fileExplorersCount,
        change: getChange(fileExplorersCount, oldFileExplorersCount),
        changeType: getChangeType(
          getChange(fileExplorersCount, oldFileExplorersCount),
        ),
      },
    };
  }
}
