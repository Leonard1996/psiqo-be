import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from 'src/app-auth/user/user.module'
import { UserService } from 'src/app-auth/user/user.service'
import { PatientDoctor } from 'src/entities/patient.doctor.entity'
import { Session } from 'src/entities/session.entity'
import { User } from 'src/entities/user.entity'
import { SessionCreatedEventService } from './session.created.event.service'
import { PatientDoctorService } from '../patient-doctor/patient.doctor.service'
import { Therapist } from 'src/entities/therapist.entity'


@Module({
    imports: [UsersModule, TypeOrmModule.forFeature([PatientDoctor, User, Session, Therapist])],
    providers: [PatientDoctorService, UserService, SessionCreatedEventService],
    exports: [PatientDoctorService, SessionCreatedEventService],
})
export class SessionModule { }
