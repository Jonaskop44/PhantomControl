import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { handleSubscription } from 'src/lib/helper';
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

      console.log('[STRIPE SESSION]: ', session);
      console.log('[STRIPE CUSTOMER]: ', customer);
      console.log('[STRIPE SUBSCRIPTION]: ', subscriptionInfo);
      console.log('[STRIPE PRODUCT]: ', product);

      //Update user role and subscription
      await handleSubscription(
        this.prisma,
        userId,
        customer.id as string,
        product.name.toLocaleUpperCase() as Role,
      );

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
}
