import {
  Controller,
  ValidationPipe,
  UsePipes,
  Res,
  UseGuards,
  HttpStatus,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Post,
  Sse,
  Req,
  Patch,
  Delete,
} from '@nestjs/common'
import { Response, Request } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { CONSTANTS } from 'src/app-auth/common/constants'
import { SessionService } from './session.serivce'
import { CreateSessionDto } from './dto/create.session-dto'
import { MailService } from '../mail/services/mail.service'
import { PatientDoctorService } from '../patient-doctor/patient.doctor.service'
import { SessionCreatedEventService } from './session.created.event.service'
import { SERVER_SENT_EVENT_TYPE } from '../common/server.sent.event.types'
import { channel } from 'diagnostics_channel'
const axios = require('axios').default

@Controller('sessions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly mailService: MailService,
    private readonly patientDoctorService: PatientDoctorService,
    private readonly sessionCreatedEventService: SessionCreatedEventService,
  ) {}

  @Get('/my-agenda')
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.DOCTOR)
  async getDoctorAgenda(@Req() request: Request, @Query('month') month: number, @Res() response: Response) {
    try {
      const agenda = await this.sessionService.getDoctorAgenda(request['user']['id'], month)
      const nextConfirmedSession = await this.sessionService.getNextConfirmedSession(request['user']['id'])
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        agenda,
        nextConfirmedSession,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true }))
  @Roles(CONSTANTS.ROLES.SUBADMIN, CONSTANTS.ROLES.DOCTOR)
  async create(@Body() createSessionDto: CreateSessionDto, @Res() response: Response, @Req() request: Request) {
    try {
      const session = await this.sessionService.create(createSessionDto, request['user']['id'])
      const { doctorName, name, id, email, doctorId } = await this.patientDoctorService.findOneWithDetails(session.patientDoctorId)
      await this.mailService.sendSessionValidation(doctorName, { email, id, name }, session.startTime, session.endTime)
      this.sessionCreatedEventService.emit(doctorId, SERVER_SENT_EVENT_TYPE.SESSION_CREATED_EVENT)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        session,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Sse('new/:doctorId')
  events(@Param('doctorId') doctorId: number) {
    return this.sessionCreatedEventService.subscribe(doctorId)
  }

  @Patch(':id/confirm')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true }))
  @Roles(CONSTANTS.ROLES.PATIENT)
  async confirm(@Req() request: Request, @Res() response: Response, @Param('id', ParseIntPipe) id: number) {
    try {
      const session = await this.sessionService.confirm(request['user']['id'], id)
      this.mailService.sendSessionLink(session.link, request['user']['email'], session.patientName)

      axios.post(process.env.CRONE_SERVER_LINK + '/crones/confirmed-session-reminder', {
        email: request['user']['email'],
        startTime: session.startTime,
        endTime: session.endTime,
        link: session.link,
        sessionId: session.sessionId,
        days: process.env.SESSION_DAYS_REMINDER,
        hours: process.env.SESSION_HOURS_REMINDER,
        name: session.patientName,
      })
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        session,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true }))
  @Roles(CONSTANTS.ROLES.ADMIN)
  async delete(@Param('id', ParseIntPipe) id: number, @Res() response: Response) {
    try {
      const sessionDetails = await this.sessionService.getSessionDetails(id)
      await this.sessionService.delete(id)
      this.mailService.sendCancelMail(sessionDetails)
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

  @Get('/all')
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.DOCTOR)
  async getAllSessionsPerDoctor(@Req() request: Request, @Query('year', ParseIntPipe) year: number, @Res() response: Response) {
    try {
      const allSessions = await this.sessionService.getAllSessionsPerDoctor(request['user']['id'], year)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        allSessions,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Get('/patients')
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.DOCTOR)
  async getPatients(@Req() request: Request, @Res() response: Response, @Query('name') name?: string) {
    try {
      const patients = await this.sessionService.getPatients(request['user']['id'], name)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        patients: patients.map((patient) => {
          delete patient.password
          return patient
        }),
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Get('patients/next-session')
  @Roles(CONSTANTS.ROLES.PATIENT)
  async getNextSession(@Req() request: Request, @Res() response: Response) {
    try {
      const nextSession = await this.sessionService.nextSession(request['user']['id'])
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        nextSession,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Get('/patients/:patientId')
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.DOCTOR)
  async getPatientDetails(@Res() response: Response, @Param('patientId', ParseIntPipe) patientId: number) {
    try {
      const numberOfSessions = await this.sessionService.getNumberOfSessions(patientId)
      const patientDetails = await this.sessionService.getPatientDetails(patientId)
      const nextSessions = await this.sessionService.nextSession(patientId)

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        patientDetails,
        numberOfSessions,
        nextSessions,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Get(':id/verify/:uuid')
  @UsePipes(new ValidationPipe())
  @Roles(CONSTANTS.ROLES.DOCTOR, CONSTANTS.ROLES.PATIENT)
  async getRTCToken(
    @Req() request: Request,
    @Param('uuid') uuid: number,
    @Param('id') id: number,
    @Res() response: Response,
    @Query('channelName') channelName: string,
  ) {
    try {
      const {
        data: { key: RTCToken },
      } = await this.sessionService.getRTCToken(id, uuid, request['user']['id'], request['user']['role'], channelName)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        RTCToken,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Patch(':id/done')
  @Roles(CONSTANTS.ROLES.DOCTOR)
  async done(@Req() request: Request, @Res() response: Response, @Param('id', ParseIntPipe) id: number) {
    try {
      const session = await this.sessionService.done(id)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        session,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }
}
