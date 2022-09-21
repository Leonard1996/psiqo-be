import { ConflictException, ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../user/user.service'
import { RegisterDto } from './dto/register.dto'
import { VerificationDto } from './dto/verification.dto'
import { MailService } from '../../app-core/mail/services/mail.service'
const crypto = require('crypto')

@Injectable()
export class AuthService {
  @Inject(JwtService)
  private jwtService: JwtService

  @Inject(MailService)
  private mailService: MailService

  @Inject(UserService)
  private userService: UserService

  async validateCredentials(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneBy({ email })
    if (!user || !user.isActive) throw new ForbiddenException('Wrong Credentials Or Inactive Account!')
    const existingPassword = user.password
    delete user.password
    return user && AuthService.compareHash(password, existingPassword) ? user : null
  }

  private static compareHash(password: string, existingPassword: string) {
    return crypto.createHash('sha256').update(password).digest('hex') === existingPassword
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateCredentials(loginDto.email, loginDto.password)

    if (!user) {
      throw new ForbiddenException('Wrong Credentials!')
    }

    const token = this.jwtService.sign({ id: user.id, email: user.email, role: user.role })

    return {
      token,
      user,
    }
  }

  async register(registerDto: RegisterDto, skipVerification?: boolean) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new ConflictException('Passwords should match')
    }
    const isExisting = await this.userService.findOneBy({ email: registerDto.email })
    if (isExisting) {
      throw new ConflictException('User with this email already exists')
    }
    const user = await this.userService.register(registerDto, skipVerification)
    !skipVerification && this.mailService.sendUserValidation(user)
    return user
  }

  validate(verificationDto: VerificationDto) {
    return this.userService.validate(verificationDto)
  }
}
