import { Injectable } from '@nestjs/common';
import { endOfMonth, format, startOfMonth, subDays, subMonths } from 'date-fns';
import { console } from 'inspector';
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
    const usersCount = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    });

    const clientsCount = await this.prisma.client.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    });

    const messagesCount = await this.prisma.message.count({
      where: {
        timestamp: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
        },
      },
    });

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const oldUsersCount = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1),
        },
      },
    });

    const oldClientsCount = await this.prisma.client.count({
      where: {
        createdAt: {
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1),
        },
      },
    });

    const oldMessagesCount = await this.prisma.message.count({
      where: {
        timestamp: {
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
      usersCount: {
        value: usersCount,
        change: getChange(usersCount, oldUsersCount),
        changeType: getChangeType(getChange(usersCount, oldUsersCount)),
      },
      clientsCount: {
        value: clientsCount,
        change: getChange(clientsCount, oldClientsCount),
        changeType: getChangeType(getChange(clientsCount, oldClientsCount)),
      },
      messagesCount: {
        value: messagesCount,
        change: getChange(messagesCount, oldMessagesCount),
        changeType: getChangeType(getChange(messagesCount, oldMessagesCount)),
      },
    };
  }

  async getUsedDevices(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const osCount = await this.prisma.client.groupBy({
      by: ['os'],
      where: {
        userId: user.role === 'ADMIN' ? undefined : userId,
      },
      _count: true,
    });

    return osCount.map((item) => {
      return {
        name: item.os,
        amount: item._count,
      };
    });
  }

  async getRegisteredClients(userId: number) {
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const clients = await this.prisma.client.groupBy({
      by: ['updatedAt'],
      where: {
        userId: user.role === 'ADMIN' ? undefined : userId,
        updatedAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
      _count: {
        id: true,
      },
    });

    const daysInLastMonth = Array.from(
      { length: lastMonthEnd.getDate() },
      (_, i) => {
        const date = new Date(lastMonthStart);
        date.setDate(i + 1);
        const formattedDate = format(date, 'yyyy-MM-dd');

        const count =
          clients.find(
            (c) => format(c.updatedAt, 'yyyy-MM-dd') === formattedDate,
          )?._count.id || 0;

        return { x: formattedDate, y: count };
      },
    );

    return daysInLastMonth;
  }
}
