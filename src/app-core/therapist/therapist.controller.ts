import { Controller, ValidationPipe, UsePipes, Res, UseGuards, HttpStatus, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { Response, Request } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { CONSTANTS } from 'src/app-auth/common/constants'

@Controller('therapists')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TherapistController {
  constructor() {}

  // @Get('therapists/calendar')
  // @Roles(CONSTANTS.ROLES.DOCTOR)
  // async getDoctorAgenda(@Param('doctorId', ParseIntPipe) doctorId: number, @Query('month') month: number, @Res() response: Response) {
  //     try {
  //         const agenda = await this.sessionService.getDoctorAgenda(doctorId, month)
  //         return response.status(HttpStatus.OK).json({
  //             statusCode: HttpStatus.OK,
  //             message: 'Success',
  //             agenda,
  //         })
  //     } catch (error) {
  //         return response.status(error.statusCode ?? error.status ?? 400).json({
  //             error,
  //         })
  //     }
  // }
}
