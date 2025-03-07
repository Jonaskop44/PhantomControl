import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtGuard } from 'src/guard/jwt.guard';

@Controller('payment')
@UseGuards(JwtGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Request() request,
    @Query('plan') planName: string,
  ) {
    if (!planName) throw new BadRequestException('Plan is required');

    return this.paymentService.createCheckoutSession(request, planName);
  }

  @Get('session-status')
  async getSessionStatus(
    @Request() request,
    @Query('session_id') sessionId: string,
  ) {
    if (!sessionId) throw new BadRequestException('Session ID is required');

    return this.paymentService.getSessionStatus(sessionId, request.user.sub.id);
  }
}
