import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { Therapist } from 'src/entities/therapist.entity'
import { Patient } from 'src/entities/patient.entity'
import { PatientDoctor } from 'src/entities/patient.doctor.entity'
import { UserController } from './user.controller'

@Module({
  imports: [TypeOrmModule.forFeature([User, Therapist, Patient, PatientDoctor])],
  providers: [UserService, UserController],
  exports: [UserService],
})
export class UsersModule {}
