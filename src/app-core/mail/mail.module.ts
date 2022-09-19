import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { Global, Module } from '@nestjs/common'
import { MailService } from './services/mail.service'
import { join } from 'path'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserService } from 'src/app-auth/user/user.service'
import { User } from 'src/entities/user.entity'
import { UsersModule } from 'src/app-auth/user/user.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Therapist } from 'src/entities/therapist.entity'
import { Patient } from 'src/entities/patient.entity'
import { PatientDoctor } from 'src/entities/patient.doctor.entity'
import { SessionModule } from '../session/sessions.module'
import { Session } from 'src/entities/session.entity'
import { Order } from 'src/entities/order.entity'

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
          dir: join(__dirname, './templates'),
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
