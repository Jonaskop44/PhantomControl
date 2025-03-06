import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { JwtGuard } from 'src/guard/jwt.guard';

@Controller('stripe')
@UseGuards(JwtGuard)
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('products')
  async getProducts() {
    return this.stripeService.getProducts();
  }

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Request() request,
    @Query('plan') planName: string,
  ) {
    if (!planName) throw new BadRequestException('Plan is required');

    return this.stripeService.createCheckoutSession(request, planName);
  }

  @Get('session-status')
  async getSessionStatus(@Query('session_id') sessionId: string) {
    if (!sessionId) throw new BadRequestException('Session ID is required');

    return this.stripeService.getSessionStatus(sessionId);
  }
}
