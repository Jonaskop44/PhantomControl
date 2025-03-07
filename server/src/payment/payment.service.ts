import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @Inject('STRIPE_SECRET_KEY') private readonly apiKey: string,
    private readonly prisma: PrismaService,
  ) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createCheckoutSession(request: Request, planName: string) {
    try {
      const planId = await this.stripe.products.search({
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

      const session = await this.stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        payment_method_types: ['card', 'paypal'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        billing_address_collection: 'required',
        return_url: `${request.headers.origin}/return?session_id={CHECKOUT_SESSION_ID}`,
      });

      return { sessionId: session.id, client_secret: session.client_secret };
    } catch (error) {
      console.log('[STRIPE createCheckoutSession]: ', error);
      throw new ConflictException('Error creating checkout session');
    }
  }

  async getSessionStatus(sessionId: string, userId: number) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      const customer = {
        id: session.customer,
        customer_details: session.customer_details,
      };
      const subscription = session.subscription;
      const subscriptionInfo = await this.stripe.subscriptions.retrieve(
        typeof subscription === 'string' ? subscription : subscription.id,
      );
      const product = await this.stripe.products.retrieve(
        subscriptionInfo.items.data[0].plan.product as string,
      );

      //Update user role and subscription
      await this.handleSubscription(
        userId,
        customer.id as string,
        product.name.toLocaleUpperCase() as Role,
      );

      return {
        status: session.payment_status,
        customer: customer,
        product: product,
      };
    } catch (error) {
      if (error.type === 'StripeInvalidRequestError')
        throw new NotFoundException('Session not found');

      console.log('[STRIPE getSessionStatus]: ', error);
      throw new InternalServerErrorException('Error getting session status');
    }
  }

  private async handleSubscription(
    userId: number,
    customerId: string,
    role: Role,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    await this.prisma.subscription.upsert({
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

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: role,
      },
    });
  }
}
