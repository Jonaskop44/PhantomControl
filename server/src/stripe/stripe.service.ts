import { Inject, Injectable } from '@nestjs/common';
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
}
