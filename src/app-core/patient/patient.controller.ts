import {
  Controller,
  Res,
  UseGuards,
  HttpStatus,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  Get,
  Patch,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '../../guards/roles.guard'
import { Roles } from '../../decorators/roles.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import { CONSTANTS } from '../../app-auth/common/constants'
import { PatientService } from './patient.service'
import global from '../../global/file-config'

@Controller('patients')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post('consent')
  @Roles(CONSTANTS.ROLES.PATIENT)
  @UseInterceptors(FileInterceptor('consent', global.multerConfig))
  async uploadConsent(@Req() request: Request, @Res() response: Response, @UploadedFile() consent: Express.Multer.File) {
    try {
      await this.patientService.uploadConsent(request['user']['id'], consent.path)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Consent updated successfully',
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Get('therapist')
  @Roles(CONSTANTS.ROLES.PATIENT)
  async getLatestTherapist(@Req() request: Request, @Res() response: Response) {
    try {
      const therapist = await this.patientService.getLatestTherapist(request['user']['id'])
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Success',
        therapist,
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }

  @Patch(':patientId')
  @Roles(CONSTANTS.ROLES.DOCTOR)
  async updateNotes(
    @Req() request: Request,
    @Res() response: Response,
    @Param('patientId', ParseIntPipe) patientId: number,
    @Body('notes') notes: string,
  ) {
    try {
      await this.patientService.updateNotes(request['user']['id'], patientId, notes)
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Notes updates successfully',
      })
    } catch (error) {
      return response.status(error.statusCode ?? error.status ?? 400).json({
        error,
      })
    }
  }
}
