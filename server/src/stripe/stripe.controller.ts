import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
