import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Global, Module } from '@nestjs/common'
import { MailService } from './services/mail.service'
import { join } from 'path'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserService } from '../../app-auth/user/user.service'
import { User } from '../../entities/user.entity'
import { UsersModule } from '../../app-auth/user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Therapist } from '../../entities/therapist.entity'
import { Patient } from '../../entities/patient.entity'
import { PatientDoctor } from '../../entities/patient.doctor.entity'
import { SessionModule } from '../session/sessions.module'
import { Session } from '../../entities/session.entity'
import { Order } from '../../entities/order.entity'

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, '../../app-core/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    SessionModule,
    TypeOrmModule.forFeature([User, Therapist, Patient, PatientDoctor, Session, Order]),
  ],
  providers: [MailService, ConfigService, UserService],
  exports: [MailService],
})
export class MailModule {}
