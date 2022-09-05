import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/app-auth/auth/auth.module'
import { UserController } from 'src/app-auth/user/user.controller'
import { UsersModule } from 'src/app-auth/user/user.module'
import { UserService } from 'src/app-auth/user/user.service'
import { GiftCard } from 'src/entities/gift.card.entity'
import { PatientDoctor } from 'src/entities/patient.doctor.entity'
import { Patient } from 'src/entities/patient.entity'
import { Product } from 'src/entities/product.entity'
import { PromoCode } from 'src/entities/promo.code.entity'
import { Session } from 'src/entities/session.entity'
import { Therapist } from 'src/entities/therapist.entity'
import { User } from 'src/entities/user.entity'
import { GiftCardController } from './giftCard/gift.card.controller'
import { GiftCardService } from './giftCard/gift.card.service'
import { PatientDoctorController } from './patient-doctor/patient.doctor.controller'
import { PatientDoctorModule } from './patient-doctor/patient.doctor.module'
import { PatientDoctorService } from './patient-doctor/patient.doctor.service'
import { PatientController } from './patient/patient.controller'
import { PatientService } from './patient/patient.service'
import { ProductController } from './product/product.controller'
import { ProductModule } from './product/product.module'
import { ProductService } from './product/product.service'
import { PromoCodeController } from './promoCode/promo.code.controller'
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
    TypeOrmModule.forFeature([PatientDoctor, User, Session, Therapist, Patient, Product, PromoCode, GiftCard]),
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
  ],
  providers: [PatientDoctorService, UserService, SessionService, PatientService, ProductService, PromoCodeService, GiftCardService],
})
export class AppCoreModule {}
