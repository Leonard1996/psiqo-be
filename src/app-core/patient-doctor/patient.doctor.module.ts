import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from 'src/app-auth/user/user.module'
import { UserService } from 'src/app-auth/user/user.service'
import { PatientDoctor } from 'src/entities/patient.doctor.entity'
import { Patient } from 'src/entities/patient.entity'
import { Therapist } from 'src/entities/therapist.entity'
import { User } from 'src/entities/user.entity'
import { PatientDoctorService } from './patient.doctor.service'

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([PatientDoctor, User, Therapist, Patient])],
  providers: [PatientDoctorService, UserService],
  exports: [PatientDoctorService],
})
export class PatientDoctorModule {}
