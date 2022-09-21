import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../app-auth/auth/auth.module'
import { UserController } from '../app-auth/user/user.controller'
import { UsersModule } from '../app-auth/user/user.module'
import { UserService } from '../app-auth/user/user.service'
import { GiftCard } from '../entities/gift.card.entity'
import { Order } from '../entities/order.entity'
import { PatientDoctor } from '../entities/patient.doctor.entity'
import { Patient } from '../entities/patient.entity'
import { Product } from '../entities/product.entity'
import { PromoCode } from '../entities/promo.code.entity'
import { Session } from '../entities/session.entity'
import { Therapist } from '../entities/therapist.entity'
import { User } from '../entities/user.entity'
import { GiftCardController } from './giftCard/gift.card.controller'
import { GiftCardModule } from './giftCard/gift.card.module'
import { GiftCardService } from './giftCard/gift.card.service'
import { OrderController } from './order/order.controller'
import { OrderModule } from './order/order.module'
import { OrderService } from './order/order.serive'
import { PatientDoctorController } from './patient-doctor/patient.doctor.controller'
import { PatientDoctorModule } from './patient-doctor/patient.doctor.module'
import { PatientDoctorService } from './patient-doctor/patient.doctor.service'
import { PatientController } from './patient/patient.controller'
import { PatientService } from './patient/patient.service'
import { ProductController } from './product/product.controller'
import { ProductModule } from './product/product.module'
import { ProductService } from './product/product.service'
import { PromoCodeController } from './promoCode/promo.code.controller'
import { PromoCodeModule } from './promoCode/promo.code.module'
import { PromoCodeService } from './promoCode/promo.code.service'
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
    ProductModule,
    OrderModule,
    PromoCodeModule,
    GiftCardModule,
    TypeOrmModule.forFeature([PatientDoctor, User, Session, Therapist, Patient, Product, PromoCode, GiftCard, Order]),
  ],
  controllers: [
    PatientDoctorController,
    UserController,
    SessionController,
    SessionCroneController,
    PatientController,
    ProductController,
    PromoCodeController,
    GiftCardController,
    OrderController,
  ],
  providers: [PatientDoctorService, UserService, SessionService, PatientService, ProductService, PromoCodeService, GiftCardService, OrderService],
})
export class AppCoreModule {}
