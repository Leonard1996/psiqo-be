import { Controller, ValidationPipe, UsePipes, Res, UseGuards, HttpStatus, Body, Post, Param, ParseIntPipe, Delete } from '@nestjs/common'
import { Response } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from 'src/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { CONSTANTS } from 'src/app-auth/common/constants'
import { CreatePatientDoctorDto } from './dto/create-patient-doctor.dto'
import { PatientDoctorService } from './patient.doctor.service'

@Controller('patients-doctors')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PatientDoctorController {
    constructor(private readonly patientDoctorService: PatientDoctorService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    @Roles(CONSTANTS.ROLES.SUBADMIN)
    async create(@Body() createPatientDoctorDto: CreatePatientDoctorDto, @Res() response: Response) {
        try {
            const patientDoctor = await this.patientDoctorService.create(createPatientDoctorDto)
            return response.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Success',
                patientDoctor,
            })
        } catch (error) {
            return response.status(error.statusCode ?? error.status ?? 400).json({
                error,
            })
        }
    }

    @Delete(':patientDoctorId')
    @UsePipes(new ValidationPipe())
    @Roles(CONSTANTS.ROLES.SUBADMIN)
    async delete(@Param('patientDoctorId', ParseIntPipe) patientDoctorId: number, @Res() response: Response) {
        try {
            const patientDoctor = await this.patientDoctorService.delete(patientDoctorId)
            return response.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Success',
                patientDoctor,
            })
        } catch (error) {
            return response.status(error.statusCode ?? error.status ?? 400).json({
                error,
            })
        }
    }
}
