import { Injectable } from '@nestjs/common';
import { endOfMonth, format, startOfMonth, subDays, subMonths } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  private lastMonthStart = startOfMonth(subMonths(new Date(), 1));
  private lastMonthEnd = endOfMonth(subMonths(new Date(), 1));
  private currentMonthStart = startOfMonth(new Date());
  private currentMonthEnd = endOfMonth(new Date());

  async getUserKpi(userId: number) {
    const clientsCount = await this.prisma.client.count({
      where: {
        userId,
        createdAt: {
          gte: this.currentMonthStart,
          lt: this.currentMonthEnd,
        },
      },
    });

    const consolesCount = await this.prisma.console.count({
      where: {
        client: { userId },
        createdAt: {
          gte: this.currentMonthStart,
          lt: this.currentMonthEnd,
        },
      },
    });

    const fileExplorersCount = await this.prisma.fileExplorer.count({
      where: {
        client: { userId },
        createdAt: {
          gte: this.currentMonthStart,
          lt: this.currentMonthEnd,
        },
      },
    });

    const oldClientsCount = await this.prisma.client.count({
      where: {
        userId,
        createdAt: {
          gte: this.lastMonthStart,
          lt: this.lastMonthEnd,
        },
      },
    });

    const oldConsolesCount = await this.prisma.console.count({
      where: {
        client: { userId },
        createdAt: {
          gte: this.lastMonthStart,
          lt: this.lastMonthEnd,
        },
      },
    });

    const oldFileExplorersCount = await this.prisma.fileExplorer.count({
      where: {
        client: { userId },
        createdAt: {
          gte: this.lastMonthStart,
          lt: this.lastMonthEnd,
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
          gte: this.currentMonthStart,
          lt: this.currentMonthEnd,
        },
      },
    });

    const clientsCount = await this.prisma.client.count({
      where: {
        createdAt: {
          gte: this.currentMonthStart,
          lt: this.currentMonthEnd,
        },
      },
    });

    const messagesCount = await this.prisma.message.count({
      where: {
        timestamp: {
          gte: this.currentMonthStart,
          lt: this.currentMonthEnd,
        },
      },
    });

    const oldUsersCount = await this.prisma.user.count({
      where: {
        createdAt: {
          gte: this.lastMonthStart,
          lt: this.lastMonthEnd,
        },
      },
    });

    const oldClientsCount = await this.prisma.client.count({
      where: {
        createdAt: {
          gte: this.lastMonthStart,
          lt: this.lastMonthEnd,
        },
      },
    });

    const oldMessagesCount = await this.prisma.message.count({
      where: {
        timestamp: {
          gte: this.lastMonthStart,
          lt: this.lastMonthEnd,
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
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    const clients = await this.prisma.client.groupBy({
      by: ['updatedAt'],
      where: {
        userId: user.role === 'ADMIN' ? undefined : userId,
        updatedAt: {
          gte: this.lastMonthStart,
          lte: this.lastMonthEnd,
        },
      },
      _count: {
        id: true,
      },
    });

    const daysInLastMonth = Array.from(
      { length: this.lastMonthEnd.getDate() },
      (_, i) => {
        const date = new Date(this.lastMonthStart);
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
