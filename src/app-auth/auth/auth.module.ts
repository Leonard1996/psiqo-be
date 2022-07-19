import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from '../strategies/jwt.strategy'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UsersModule } from '../user/user.module'

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${Number.MAX_SAFE_INTEGER}s` },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
})
export class AuthModule {}
