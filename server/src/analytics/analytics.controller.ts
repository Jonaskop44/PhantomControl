import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtGuard } from 'src/guard/jwt.guard';

@Controller('analytics')
@UseGuards(JwtGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('user-kpi')
  async getUserKpi(@Request() request) {
    return await this.analyticsService.getUserKpi(request.user.sub.id);
  }
}
