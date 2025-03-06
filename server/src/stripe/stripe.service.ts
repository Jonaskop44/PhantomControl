import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(@Inject('STRIPE_SECRET_KEY') private readonly apiKey: string) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async getProducts() {
    const price = await this.stripe.prices.list();
    console.log(price);
    const mian = await this.stripe.prices.retrieve(
      'price_1QzgacIzdslgLpcvBaPwNv9h',
    );
    console.log(mian);
    return (await this.stripe.products.list()).data;
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
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        return_url: `${request.headers.origin}/return?session_id={CHECKOUT_SESSION_ID}`,
      });

      return { sessionId: session.id, client_secret: session.client_secret };
    } catch (error) {
      console.log('[STRIPE createCheckoutSession]: ', error);
      throw new ConflictException('Error creating checkout session');
    }
  }

  async getSessionStatus(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      return { status: session.payment_status, customer: session.customer };
    } catch (error) {
      if (error.type === 'StripeInvalidRequestError')
        throw new NotFoundException('Session not found');

      console.log('[STRIPE getSessionStatus]: ', error);
      throw new InternalServerErrorException('Error getting session status');
    }
  }
}
