import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../../app-auth/user/user.module'
import { UserService } from '../../app-auth/user/user.service'
import { PatientDoctor } from '../../entities/patient.doctor.entity'
import { Session } from '../../entities/session.entity'
import { User } from '../../entities/user.entity'
import { SessionCreatedEventService } from './session.created.event.service'
import { PatientDoctorService } from '../patient-doctor/patient.doctor.service'
import { Therapist } from '../../entities/therapist.entity'
import { Patient } from '../../entities/patient.entity'
import { Order } from '../../entities/order.entity'

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([PatientDoctor, User, Session, Therapist, Patient, Order])],
  providers: [PatientDoctorService, UserService, SessionCreatedEventService],
  exports: [PatientDoctorService, SessionCreatedEventService],
})
export class SessionModule {}
