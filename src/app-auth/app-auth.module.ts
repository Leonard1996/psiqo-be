import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PatientDoctor } from 'src/entities/patient.doctor.entity'
import { Patient } from 'src/entities/patient.entity'
import { Therapist } from 'src/entities/therapist.entity'
import { User } from 'src/entities/user.entity'
import { AuthModule } from './auth/auth.module'
import { UserController } from './user/user.controller'
import { UserService } from './user/user.service'

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([User, Therapist, Patient, PatientDoctor])],
  controllers: [UserController],
  providers: [UserService],
})
export class AppAuthModule {}
