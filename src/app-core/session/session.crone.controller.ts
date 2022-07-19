import { Controller, ValidationPipe, UsePipes, Res, HttpStatus, Body, ParseIntPipe, Query, Post } from '@nestjs/common'
import { Response } from 'express'
import { SessionService } from './session.serivce'
import { MailService } from '../mail/services/mail.service'
import { RemindMailDto } from './dto/reminder.mail-dto'


//PUBLIC CONTROLLERs FOR CRONES WILL BE ACCESSED FROM CRONES SERVICE 

@Controller('sessions/crones')
export class SessionCroneController {
    constructor(private readonly sessionService: SessionService,
        private readonly mailService: MailService) { }

    @Post('reminder')
    @UsePipes(new ValidationPipe())
    async remindConfirmedSession(@Body() reminderMailDto: RemindMailDto, @Query('sessionId', ParseIntPipe) sessionId: number, @Res() response: Response) {
        const { name, email, amount, daysOrHours, link } = reminderMailDto
        try {
            await this.sessionService.validateSession(sessionId, link);
            this.mailService.sendConfirmedSessionReminder(name, email, amount, daysOrHours, link)
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
