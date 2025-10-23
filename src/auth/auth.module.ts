import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './Strategy/jwt.strategy';
import { JwtGuard } from './Guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';


@Module({
  controllers: [AuthController] ,
  providers : [AuthService, JwtStrategy, JwtGuard] ,
  imports : [JwtModule , PrismaModule ]
})
export class AuthModule {}
