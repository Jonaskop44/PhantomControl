import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { getPlanAndPrice, handleSubscription } from 'src/lib/helper';
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

  async createCheckoutSession(request: Request, planName: Role) {
    const priceId = await getPlanAndPrice(this.stripe, planName);

    const session = await this.stripe.checkout.sessions
      .create({
        ui_mode: 'embedded',
        payment_method_types: ['card', 'paypal'],
        line_items: [
          {
            price: priceId.price,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        billing_address_collection: 'required',
        automatic_tax: { enabled: true },
        return_url: `${request.headers.origin}/return?session_id={CHECKOUT_SESSION_ID}`,
      })
      .catch(() => {
        throw new ConflictException('Error creating checkout session');
      });

    return { sessionId: session.id, client_secret: session.client_secret };
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
      if (session.payment_status === 'paid') {
        await handleSubscription(
          this.prisma,
          userId,
          customer.id as string,
          product.name.toLocaleUpperCase() as Role,
        );
      }

      const { phone, tax_exempt, tax_ids, ...customer_details } =
        customer.customer_details;

      return {
        status: session.payment_status,
        customer: customer_details,
        product: { name: product.name, price: session.amount_total / 100 },
      };
    } catch (error) {
      if (error.type === 'StripeInvalidRequestError')
        throw new NotFoundException('Session not found');

      console.log('[STRIPE getSessionStatus]: ', error);
      throw new InternalServerErrorException('Error getting session status');
    }
  }

  async getAllInvoices(userId: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!subscription)
      throw new NotFoundException('This user has no subscription');

    const invoices = await this.stripe.invoices
      .list({
        customer: subscription.customerId,
      })
      .catch(() => {
        throw new ConflictException(
          'There was an error while fetching invoices',
        );
      });

    return invoices.data.map((invoice) => ({
      amount: invoice.amount_paid / 100,
      status: invoice.status,
      createdAt: invoice.created,
    }));
  }

  async getcurrentSubscription(userId: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!subscription)
      throw new NotFoundException('This user has no subscription');

    const stripeSubscription = await this.stripe.subscriptions
      .retrieve(subscription.customerId)
      .catch(() => {
        throw new ConflictException(
          'There was an error while fetching subscription',
        );
      });

    return stripeSubscription;
  }
}
