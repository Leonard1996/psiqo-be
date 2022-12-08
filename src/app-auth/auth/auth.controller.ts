import { Controller, Post, Body, ValidationPipe, UsePipes, Res, HttpStatus, Req, UseInterceptors, UploadedFile } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { Response, Request } from 'express'
import { RegisterDto } from './dto/register.dto'
import { VerificationDto } from './dto/verification.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import global from '../../global/file-config'
import { UserService } from '../user/user.service'
import { ROLES } from '../common/constants'
import { MailService } from '../../../src/app-core/mail/services/mail.service'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService, private readonly mailService: MailService) {}

  @Post('/login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto, @Res() response: Response) {
    try {
      const data = await this.authService.login(loginDto)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        data,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Post('/register')
  @UsePipes(new ValidationPipe())
  async register(@Body() registerDto: RegisterDto, @Res() response: Response) {
    try {
      registerDto.role = ROLES.PATIENT
      await this.authService.register(registerDto)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Post('/validate')
  async validate(@Body() verificationDto: VerificationDto, @Res() response: Response) {
    try {
      await this.authService.validate(verificationDto)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Post('/register-therapist')
  @UseInterceptors(FileInterceptor('cv', global.multerConfig))
  async registerTherapist(@Req() request: Request, @Res() response: Response, @UploadedFile() cv: Express.Multer.File) {
    try {
      const registerDto = {
        ...request.body,
        role: ROLES.DOCTOR,
      }
      const { id } = await this.authService.register(registerDto, true)
      delete request.body.password
      delete request.body.confirmPassword
      await this.userService.registerTherapist({ userId: id, details: request.body, cv: cv.path, rate: 0.0 })
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Your application has been submitted',
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Post('/reset-code')
  @UsePipes(new ValidationPipe())
  async getResetCode(@Res() response: Response, @Body() payload: any, @Req() request: Request) {
    try {
      const resetPasswordCode = await this.userService.getResetCode(payload.email)
      this.mailService.sendPasswordResetCode(payload.email, resetPasswordCode)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Post('/reset-password')
  @UsePipes(new ValidationPipe())
  async getResetPassword(@Res() response: Response, @Body() payload: any, @Req() request: Request) {
    try {
      await this.userService.resetPassword(payload)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }
}
