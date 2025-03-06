import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, ClientModule, AnalyticsModule, StripeModule.forRootAsync()],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
