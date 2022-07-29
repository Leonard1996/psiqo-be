import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/app-auth/auth/auth.module'
import { UserController } from 'src/app-auth/user/user.controller'
import { UsersModule } from 'src/app-auth/user/user.module'
import { UserService } from 'src/app-auth/user/user.service'
import { PatientDoctor } from 'src/entities/patient.doctor.entity'
import { Patient } from 'src/entities/patient.entity'
import { Session } from 'src/entities/session.entity'
import { Therapist } from 'src/entities/therapist.entity'
import { User } from 'src/entities/user.entity'
import { PatientDoctorController } from './patient-doctor/patient.doctor.controller'
import { PatientDoctorModule } from './patient-doctor/patient.doctor.module'
import { PatientDoctorService } from './patient-doctor/patient.doctor.service'
import { PatientController } from './patient/patient.controller'
import { PatientService } from './patient/patient.service'
import { SessionController } from './session/session.controller'
import { SessionCroneController } from './session/session.crone.controller'
import { SessionService } from './session/session.serivce'
import { SessionModule } from './session/sessions.module'

@Module({
  imports: [
    AuthModule,
    PatientDoctorModule,
    UsersModule,
    SessionModule,
    TypeOrmModule.forFeature([PatientDoctor, User, Session, Therapist, Patient]),
  ],
  controllers: [PatientDoctorController, UserController, SessionController, SessionCroneController, PatientController],
  providers: [PatientDoctorService, UserService, SessionService, PatientService],
})
export class AppCoreModule {}
