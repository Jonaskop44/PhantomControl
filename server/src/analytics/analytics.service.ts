import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getUserKpi(userId: number) {
    const clientsCount = await this.prisma.client.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    });

    const consolesCount = await this.prisma.console.count({
      where: {
        client: { userId },
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    });

    const fileExplorersCount = await this.prisma.fileExplorer.count({
      where: {
        client: { userId },
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    });

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const oldClientsCount = await this.prisma.client.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1),
        },
      },
    });

    const oldConsolesCount = await this.prisma.console.count({
      where: {
        client: { userId },
        createdAt: {
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1),
        },
      },
    });

    const oldFileExplorersCount = await this.prisma.fileExplorer.count({
      where: {
        client: { userId },
        createdAt: {
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1),
        },
      },
    });

    const getChange = (current: number, previous: number): string => {
      if (previous === 0) return current > 0 ? '100%' : '0%';
      return `${Math.round(((current - previous) / previous) * 100)}%`;
    };

    const getChangeType = (change: string): string => {
      const value = parseInt(change);
      if (value > 0) return 'positive';
      if (value < 0) return 'negative';
      return 'neutral';
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

  async getAdminKpi() {
    const clientsCount = await this.prisma.client.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    });

    const consolesCount = await this.prisma.console.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    });

    const fileExplorersCount = await this.prisma.fileExplorer.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    });

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const oldClientsCount = await this.prisma.client.count({
      where: {
        createdAt: {
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1),
        },
      },
    });

    const oldConsolesCount = await this.prisma.console.count({
      where: {
        createdAt: {
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1),
        },
      },
    });

    const oldFileExplorersCount = await this.prisma.fileExplorer.count({
      where: {
        createdAt: {
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1),
        },
      },
    });

    const getChange = (current: number, previous: number): string => {
      if (previous === 0) return current > 0 ? '100%' : '0%';
      return `${Math.round(((current - previous) / previous) * 100)}%`;
    };

    const getChangeType = (change: string): string => {
      const value = parseInt(change);
      if (value > 0) return 'positive';
      if (value < 0) return 'negative';
      return 'neutral';
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
