import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { ModuleRef } from '@nestjs/core'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef, private authService: AuthService) {
    super({
      passReqToCallback: true,
      usernameField: '__token',
      passwordField: '__pass',
    })
  }

  async validate(request: Request, username?: string, password?: string): Promise<any> {
    // let authorization = request.headers.authorization
    // if (!authorization) throw new UnauthorizedException()
    // const [_, token] = authorization.split(' ')
    // if (!token) throw new UnauthorizedException()
    // const user = await this.authService.checkToken(token)
    // if (!user) {
    //   throw new UnauthorizedException()
    // }
    // return user
  }
}
