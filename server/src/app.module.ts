import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, ClientModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
