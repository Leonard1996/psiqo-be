import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from '../../app-auth/user/user.module'
import { UserService } from '../../app-auth/user/user.service'
import { PatientDoctor } from '../../entities/patient.doctor.entity'
import { Session } from '../../entities/session.entity'
import { User } from '../../entities/user.entity'
import { PatientDoctorService } from '../patient-doctor/patient.doctor.service'
import { Therapist } from '../../entities/therapist.entity'
import { Patient } from '../../entities/patient.entity'
import { PromoCode } from '../../entities/promo.code.entity'
import { GiftCard } from '../../entities/gift.card.entity'
import { GiftCardService } from './gift.card.service'
import { Order } from '../../entities/order.entity'

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([PatientDoctor, User, Session, Therapist, Patient, PromoCode, GiftCard, Order])],
  providers: [PatientDoctorService, UserService, GiftCardService],
  exports: [PatientDoctorService],
})
export class GiftCardModule {}
