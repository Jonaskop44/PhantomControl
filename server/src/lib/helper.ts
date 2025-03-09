import { ConflictException, NotFoundException, Request } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

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

export const getPlanAndPrice = async (stripe: Stripe, planName: Role) => {
  const planId = await stripe.products.search({
    query: `name:'${planName}'`,
    expand: ['data.default_price'],
  });

  if (!planId.data.length) {
    throw new ConflictException('Plan not found');
  }

  const product = planId.data[0];

  if (!product.default_price) {
    throw new ConflictException('Price not found');
  }

  const priceId =
    typeof product.default_price === 'string'
      ? product.default_price
      : product.default_price.id;

  return { price: priceId };
};
