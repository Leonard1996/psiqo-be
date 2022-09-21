import { Controller, ValidationPipe, UsePipes, Res, Get, UseGuards, Req, HttpStatus, Patch, Body, Param, ParseIntPipe, Post } from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { UserService } from './user.service'
import { RolesGuard } from 'src/guards/roles.guard'
import { UpdateMeDto } from './dto/update-me.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Roles } from 'src/decorators/roles.decorator'
import { CONSTANTS } from '../common/constants'
import { join } from 'path'

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UsePipes(new ValidationPipe())
  async getMe(@Req() request: Request, @Res() response: Response) {
    try {
      const user = await this.userService.findOne({ where: { id: request['user']['id'] }, relations: ['patient', 'therapist'] })
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        user,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Patch('me')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true }))
  async updateMe(@Req() request: Request, @Res() response: Response, @Body() updateMeDto: UpdateMeDto) {
    try {
      const user = await this.userService.updateOne(request['user']['id'], updateMeDto)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        user,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Patch(':userId')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true }))
  @Roles(CONSTANTS.ROLES.ADMIN)
  async update(@Req() request: Request, @Res() response: Response, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.updateOne(request['user']['id'], updateUserDto)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        user,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Get('forms')
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.SUBADMIN)
  async getUnreadFormNotifications(@Res() response: Response) {
    try {
      const notifications = await this.userService.getUnreadFormNotifications()
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        notifications,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Get(':userId/forms')
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.SUBADMIN)
  async getFormDetails(@Param('userId', ParseIntPipe) userId: number, @Res() response: Response) {
    try {
      const details = await this.userService.getFormDetails(userId)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        details,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Get(':userid/check-confirm-status')
  @UsePipes(new ValidationPipe())
  async checkConfirmStatus(@Req() request: Request, @Res() response: Response) {
    try {
      const status = await this.userService.checkConfirmStatus(request['user']['id'])
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        status: Boolean(status),
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Get('consent')
  getFile() {
    return join(process.cwd(), 'src/static-files/consent.pdf')
  }

  @Get('/patients-statistics')
  @Roles(CONSTANTS.ROLES.ADMIN)
  @UsePipes(new ValidationPipe())
  async getPatientsStatistics(@Req() request: Request, @Res() response: Response) {
    try {
      const statistics = await this.userService.getPatientsStatistics()
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        statistics,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Get('/patients')
  @Roles(CONSTANTS.ROLES.ADMIN)
  @UsePipes(new ValidationPipe())
  async get(@Req() request: Request, @Res() response: Response) {
    try {
      const patients = await this.userService.listPatients()
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        patients,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Get('/doctors')
  @Roles(CONSTANTS.ROLES.ADMIN)
  @UsePipes(new ValidationPipe())
  async getDoctors(@Req() request: Request, @Res() response: Response) {
    try {
      const doctors = await this.userService.listDoctors()
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        doctors,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Post(':id/doctors-rate')
  @Roles(CONSTANTS.ROLES.ADMIN)
  @UsePipes(new ValidationPipe())
  async setDoctorsRate(@Req() request: Request, @Res() response: Response, @Body() payload: { rate: number }, @Param('id', ParseIntPipe) id: number) {
    try {
      const doctor = await this.userService.setDoctorRate(payload, id)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        doctor,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Get('/doctors-statistics')
  // @Roles(CONSTANTS.ROLES.ADMIN)
  @UsePipes(new ValidationPipe())
  async getDoctorsStatistics(@Req() request: Request, @Res() response: Response) {
    try {
      const statistics = await this.userService.getDoctorsStatistics()
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        statistics,
      })
    } catch (error) {
      console.log({ error })
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }
}
