import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { sub } from 'date-fns';
import { Request } from 'express';
import {
  checkForExistingCustomer,
  checkForExistingSubscription,
  getPlanAndPrice,
  handleSubscription,
} from 'src/lib/helper';
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
    const customer = await checkForExistingCustomer(
      this.prisma,
      this.stripe,
      request.user.sub.id,
    );
    await checkForExistingSubscription(this.stripe, customer);

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
        subscription_data: {
          trial_period_days: customer.status ? undefined : 7,
        },
        saved_payment_method_options: {
          payment_method_save: 'enabled',
        },
        mode: 'subscription',
        billing_address_collection: 'required',
        automatic_tax: { enabled: true },
        customer: customer.status
          ? customer.subscription.customerId
          : undefined,
        return_url: `${request.headers.origin}/return?session_id={CHECKOUT_SESSION_ID}`,
      })
      .catch((error) => {
        console.log('[STRIPE createCheckoutSession]: ', error);
        throw new ConflictException('Error creating checkout session');
      });

    return { sessionId: session.id, client_secret: session.client_secret };
  }

  async getSessionStatus(sessionId: string, userId: number) {
    const session = await this.stripe.checkout.sessions
      .retrieve(sessionId)
      .catch(() => {
        throw new NotFoundException('Session not found');
      });
    const customer = {
      id: session.customer,
      customer_details: session.customer_details,
    };
    const subscription = session.subscription;
    const subscriptionInfo = await this.stripe.subscriptions
      .retrieve(subscription as string)
      .catch(() => {
        throw new NotFoundException('Subscription not found');
      });
    const product = await this.stripe.products
      .retrieve(subscriptionInfo.items.data[0].plan.product as string)
      .catch(() => {
        throw new NotFoundException('Product not found');
      });

    //Update user role and subscription
    if (session.payment_status === 'paid') {
      await handleSubscription(
        this.prisma,
        userId,
        customer.id as string,
        subscriptionInfo.id,
        product.name.toLocaleUpperCase() as Role,
      );
    }

    const { phone, tax_exempt, tax_ids, ...customer_details } =
      customer.customer_details;

    return {
      status: session.payment_status,
      customer: customer_details,
      product: {
        name: product.name,
        price: subscriptionInfo.items.data[0].plan.amount / 100,
      },
    };
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
      amount_paid: invoice.amount_paid / 100,
      status: invoice.amount_paid === 0 ? 'trial' : invoice.status,
      createdAt: invoice.created,
    }));
  }

  async getCurrentSubscription(userId: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!subscription)
      throw new NotFoundException('This user has no subscription');

    const stripeSubscription = await this.stripe.subscriptions
      .retrieve(subscription.subscriptionId)
      .catch((error) => {
        console.log('[STRIPE getCurrentSubscription]: ', error);
        throw new ConflictException(
          'There was an error while fetching subscription',
        );
      });

    const stripeProduct = await this.stripe.products
      .retrieve(stripeSubscription.items.data[0].plan.product as string)
      .catch(() => {
        throw new NotFoundException('Product not found');
      });

    const stripePaymentMethod = await this.stripe.paymentMethods
      .retrieve(stripeSubscription.default_payment_method as string)
      .catch(() => {
        throw new NotFoundException('Payment method not found');
      });

    console.log(stripePaymentMethod);

    const {
      trial_settings,
      payment_settings,
      invoice_settings,
      cancellation_details,
      automatic_tax,
      transfer_data,
      test_clock,
      trial_start,
      trial_end,
      items,
      ...subscriptionRest
    } = stripeSubscription;

    return { subscription: subscriptionRest, product: stripeProduct };
  }
}
