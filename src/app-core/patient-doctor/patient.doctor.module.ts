import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../../app-auth/user/user.module'
import { UserService } from '../../app-auth/user/user.service'
import { Order } from '../../entities/order.entity'
import { PatientDoctor } from '../../entities/patient.doctor.entity'
import { Patient } from '../../entities/patient.entity'
import { Session } from '../../entities/session.entity'
import { Therapist } from '../../entities/therapist.entity'
import { User } from '../../entities/user.entity'
import { SessionModule } from '../session/sessions.module'
import { PatientDoctorService } from './patient.doctor.service'

@Module({
  imports: [UsersModule, SessionModule, TypeOrmModule.forFeature([PatientDoctor, User, Therapist, Patient, Session, Order])],
  providers: [PatientDoctorService, UserService],
  exports: [PatientDoctorService],
})
export class PatientDoctorModule {}
