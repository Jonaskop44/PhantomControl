import { NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export const handleSubscription = async (
  prisma: PrismaService,
  userId: number,
  customerId: string,
  role: Role,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new NotFoundException('User not found');

  await prisma.subscription.upsert({
    where: {
      userId: userId,
    },
    create: {
      userId: userId,
      customerId: customerId,
    },
    update: {
      customerId: customerId,
    },
  });

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: role,
    },
  });
};
