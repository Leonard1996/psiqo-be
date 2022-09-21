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
import { Product } from '../../entities/product.entity'
import { GiftCard } from '../../entities/gift.card.entity'
import { PromoCode } from '../../entities/promo.code.entity'
import { Order } from '../../entities/order.entity'
import { PromoCodeModule } from '../promoCode/promo.code.module'
import { GiftCardModule } from '../giftCard/gift.card.module'
import { OrderService } from './order.serive'
import { ProductService } from '../product/product.service'

@Module({
  imports: [
    UsersModule,
    PromoCodeModule,
    GiftCardModule,
    TypeOrmModule.forFeature([PatientDoctor, User, Session, Therapist, Patient, Product, GiftCard, PromoCode, Order]),
  ],
  providers: [PatientDoctorService, UserService, OrderService, ProductService],
  exports: [PatientDoctorService],
})
export class OrderModule {}
