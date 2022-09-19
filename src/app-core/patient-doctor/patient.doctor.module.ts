import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from 'src/app-auth/user/user.module'
import { UserService } from 'src/app-auth/user/user.service'
import { Order } from 'src/entities/order.entity'
import { PatientDoctor } from 'src/entities/patient.doctor.entity'
import { Patient } from 'src/entities/patient.entity'
import { Session } from 'src/entities/session.entity'
import { Therapist } from 'src/entities/therapist.entity'
import { User } from 'src/entities/user.entity'
import { SessionModule } from '../session/sessions.module'
import { PatientDoctorService } from './patient.doctor.service'

@Module({
  imports: [UsersModule, SessionModule, TypeOrmModule.forFeature([PatientDoctor, User, Therapist, Patient, Session, Order])],
  providers: [PatientDoctorService, UserService],
  exports: [PatientDoctorService],
})
export class PatientDoctorModule {}
