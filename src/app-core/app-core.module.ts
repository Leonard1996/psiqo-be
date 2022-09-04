import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from 'src/app-auth/auth/auth.module'
import { UserController } from 'src/app-auth/user/user.controller'
import { UsersModule } from 'src/app-auth/user/user.module'
import { UserService } from 'src/app-auth/user/user.service'
import { PatientDoctor } from 'src/entities/patient.doctor.entity'
import { Patient } from 'src/entities/patient.entity'
import { Product } from 'src/entities/product.entity'
import { PromoCode } from 'src/entities/promo.code.entity'
import { Session } from 'src/entities/session.entity'
import { Therapist } from 'src/entities/therapist.entity'
import { User } from 'src/entities/user.entity'
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
    TypeOrmModule.forFeature([PatientDoctor, User, Session, Therapist, Patient, Product, PromoCode]),
  ],
  controllers: [
    PatientDoctorController,
    UserController,
    SessionController,
    SessionCroneController,
    PatientController,
    ProductController,
    PromoCodeController,
  ],
  providers: [PatientDoctorService, UserService, SessionService, PatientService, ProductService, PromoCodeService],
})
export class AppCoreModule {}
