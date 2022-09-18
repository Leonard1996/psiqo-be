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
import { Product } from 'src/entities/product.entity'
import { GiftCard } from 'src/entities/gift.card.entity'
import { PromoCode } from 'src/entities/promo.code.entity'
import { Order } from 'src/entities/order.entity'
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
