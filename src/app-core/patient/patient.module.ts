import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../../app-auth/user/user.module'
import { UserService } from '../../app-auth/user/user.service'
import { Patient } from '../../entities/patient.entity'
import { PatientService } from './patient.service'

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Patient])],
  providers: [PatientService, UserService],
  exports: [PatientService],
})
export class PatientDoctorModule {}
