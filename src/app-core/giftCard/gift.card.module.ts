import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from 'src/app-auth/user/user.module'
import { UserService } from 'src/app-auth/user/user.service'
import { PatientDoctor } from 'src/entities/patient.doctor.entity'
import { Session } from 'src/entities/session.entity'
import { User } from 'src/entities/user.entity'
import { PatientDoctorService } from '../patient-doctor/patient.doctor.service'
import { Therapist } from 'src/entities/therapist.entity'
import { Patient } from 'src/entities/patient.entity'
import { PromoCode } from 'src/entities/promo.code.entity'
import { GiftCard } from 'src/entities/gift.card.entity'
import { GiftCardService } from './gift.card.service'
import { Order } from 'src/entities/order.entity'

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([PatientDoctor, User, Session, Therapist, Patient, PromoCode, GiftCard, Order])],
  providers: [PatientDoctorService, UserService, GiftCardService],
  exports: [PatientDoctorService],
})
export class GiftCardModule {}
