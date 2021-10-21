import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule } from '../../config/config.module'
import { ConfigService } from '../../config/config.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { GoogleStrategy } from './google.strategy'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getString('JWT_SECRET', true),
        signOptions: { expiresIn: configService.getNumber('JWT_ACCESS_TOKEN_EXPIRATION_TIME', true) },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
