import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SessionModule } from '../app-core/session/sessions.module'
import { Order } from '../entities/order.entity'
import { PatientDoctor } from '../entities/patient.doctor.entity'
import { Patient } from '../entities/patient.entity'
import { Session } from '../entities/session.entity'
import { Therapist } from '../entities/therapist.entity'
import { User } from '../entities/user.entity'
import { AuthModule } from './auth/auth.module'
import { UserController } from './user/user.controller'
import { UserService } from './user/user.service'

@Module({
  imports: [AuthModule, SessionModule, TypeOrmModule.forFeature([User, Therapist, Patient, PatientDoctor, Session, Order])],
  controllers: [UserController],
  providers: [UserService],
})
export class AppAuthModule {}
