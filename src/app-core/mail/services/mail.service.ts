import { Inject, Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { User } from 'src/entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { PromoCode } from 'src/entities/promo.code.entity'
import { UserService } from 'src/app-auth/user/user.service'
import { PatientService } from 'src/app-core/patient/patient.service'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private configService: ConfigService) {}

  @Inject(UserService)
  private userService: UserService

  private initialToUpperCase = (name: string) => name.charAt(0).toLocaleUpperCase() + name.slice(1)

  async sendUserValidation({ email, name, verificationCode }: User) {
    const url = `${this.configService.get('FRONTEND_URL')}/validate?email=${email}`

    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Psiqo! Please validate your account',
      template: '/confirmation',
      context: {
        name: this.initialToUpperCase(name),
        url,
        verificationCode,
      },
    })
  }

  async sendSessionValidation(doctorName: string, { email, id, name }: { email: string; id: number; name: string }, startTime: Date, endTime: Date) {
    const url = `${this.configService.get('FRONTEND_URL')}/profile/${id}`

    await this.mailerService.sendMail({
      to: email,
      subject: `Psiqo session invitation with ${this.initialToUpperCase(doctorName)}`,
      template: '/session-validation',
      context: {
        name: this.initialToUpperCase(name),
        url,
        startTime,
        endTime,
        doctorName: this.initialToUpperCase(doctorName),
      },
    })
  }

  async sendSessionLink(link: string, email: string, name: string) {
    const url = `${this.configService.get('FRONTEND_URL')}/${link}`

    await this.mailerService.sendMail({
      to: email,
      subject: `Psiqo video call session link`,
      template: '/session-link',
      context: {
        name: this.initialToUpperCase(name),
        url,
      },
    })
  }

  async sendConfirmedSessionReminder(name: string, email: string, amount: number, daysOrHours: string, link: string) {
    const url = `${this.configService.get('FRONTEND_URL')}/${link}`

    await this.mailerService.sendMail({
      to: email,
      subject: `Psiqo video call session reminder`,
      template: '/confirmed-session-reminder',
      context: {
        name: this.initialToUpperCase(name),
        url,
        amount,
        daysOrHours,
      },
    })
  }

  async sendCancelMail(sessionDetails: { name: string; email: string; startTime: string }) {
    await this.mailerService.sendMail({
      to: sessionDetails.email,
      subject: `Psiqo session canceled!`,
      template: '/session-cancel',
      context: {
        name: this.initialToUpperCase(sessionDetails.name),
        startTime: sessionDetails.startTime,
      },
    })
  }

  async sendPromoCodeMail(promoCode: PromoCode) {
    let patients = []
    if (promoCode.name === 'discount' && !promoCode.userId) {
      patients = await this.userService.listPatients()
    }
    if (promoCode.name === 'discount' && promoCode.userId) {
      patients = await this.userService.listPatients(promoCode.userId)
    }

    const mailQueries = patients.map((patient) => {
      return this.mailerService.sendMail({
        to: patient.email,
        subject: `Psiqo promo code!`,
        template: '/promo-code',
        context: {
          name: this.initialToUpperCase(patient.name),
          promoCode,
        },
      })
    })
    Promise.allSettled(mailQueries)
  }
}
