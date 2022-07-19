import { Controller, ValidationPipe, UsePipes, Res, UseGuards, HttpStatus, Body, Get, Param, ParseIntPipe, Query, Post, Sse, Req, Patch, Session, Delete } from '@nestjs/common'
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
const axios = require('axios').default;

@Controller('sessions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SessionController {
    constructor(private readonly sessionService: SessionService,
        private readonly mailService: MailService,
        private readonly patientDoctorService: PatientDoctorService,
        private readonly sessionCreatedEventService: SessionCreatedEventService) { }

    @Get('doctors/:doctorId')
    @UsePipes(new ValidationPipe())
    @Roles(CONSTANTS.ROLES.SUBADMIN, CONSTANTS.ROLES.DOCTOR)
    async getDoctorAgenda(@Param('doctorId', ParseIntPipe) doctorId: number, @Query('month') month: number, @Res() response: Response) {
        try {
            const agenda = await this.sessionService.getDoctorAgenda(doctorId, month)
            return response.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Success',
                agenda,
            })
        } catch (error) {
            return response.status(error.statusCode ?? error.status ?? 400).json({
                error,
            })
        }
    }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true }))
    @Roles(CONSTANTS.ROLES.SUBADMIN)
    async create(@Body() createSessionDto: CreateSessionDto, @Res() response: Response) {
        try {
            const agenda = await this.sessionService.create(createSessionDto)
            const { doctorName, name, id, email, doctorId } = await this.patientDoctorService.findOneWithDetails(createSessionDto.patientDoctorId)
            await this.mailService.sendSessionValidation(doctorName, { email, id, name }, agenda.startTime, agenda.endTime)
            this.sessionCreatedEventService.emit(doctorId, SERVER_SENT_EVENT_TYPE.SESSION_CREATED_EVENT)
            return response.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Success',
                agenda,
            })
        } catch (error) {
            return response.status(error.statusCode ?? error.status ?? 400).json({
                error,
            })
        }
    }

    @Sse('new/:doctorId')
    events(@Param('doctorId') doctorId: number) {
        return this.sessionCreatedEventService.subscribe(doctorId);
    }

    @Patch('confirm')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, skipMissingProperties: true }))
    @Roles(CONSTANTS.ROLES.PATIENT)
    async confirm(@Req() request: Request, @Res() response: Response) {
        try {
            const session = await this.sessionService.confirm(request['user']['id'])
            this.mailService.sendSessionLink(session.link, request['user']['email'], session.patientName)

            axios.post(process.env.CRONE_SERVER_LINK + "/crones/confirmed-session-reminder", {
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
                session
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
}
