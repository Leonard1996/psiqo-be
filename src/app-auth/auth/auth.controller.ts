import { Controller, Post, Body, ValidationPipe, UsePipes, Res, HttpStatus, Req, UseInterceptors, UploadedFile } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { Response, Request } from 'express'
import { RegisterDto } from './dto/register.dto'
import { VerificationDto } from './dto/verification.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import global from 'src/global/file-config'
import * as crypto from 'crypto'
import { UserService } from '../user/user.service'
import { ROLES } from '../common/constants'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) { }

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
        role:ROLES.DOCTOR
      }
      const { id } = await this.authService.register(registerDto, true)
      await this.userService.registerTherapist({ userId: id, details: request.body, cv: cv.path })
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
}

