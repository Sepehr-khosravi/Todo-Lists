import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/Strategy/jwt.strategy';
import { JwtGuard } from './auth/Guard';
import { TodoModule } from './todo/todo.module';


const config = new ConfigService();
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({isGlobal : true}),
    PrismaModule ,
    JwtModule.register({
        secret : config.get<string>("JWT_KEY") || "1234sepehrkhosravi!c" ,
        signOptions : {expiresIn : "1d"}
    }),
    TodoModule ,
  ],
  providers : [JwtStrategy , JwtGuard]
})
export class AppModule {}
