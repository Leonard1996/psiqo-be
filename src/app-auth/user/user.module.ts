import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { Therapist } from 'src/entities/therapist.entity'
import { Patient } from 'src/entities/patient.entity'
import { PatientDoctor } from 'src/entities/patient.doctor.entity'
import { UserController } from './user.controller'
import { Session } from 'src/entities/session.entity'
import { Order } from 'src/entities/order.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Therapist, Patient, PatientDoctor, Session, Order])],
  providers: [UserService, UserController],
  exports: [UserService],
})
export class UsersModule {}
