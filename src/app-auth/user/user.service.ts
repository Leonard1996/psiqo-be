import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { RegisterDto } from '../auth/dto/register.dto'
import { VerificationDto } from '../auth/dto/verification.dto'
import { UpdateMeDto } from './dto/update-me.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { RegisterTherapistDto } from '../auth/dto/register-therapist.dto'
import { Therapist } from 'src/entities/therapist.entity'
import { Patient } from 'src/entities/patient.entity'
import { PatientDoctor } from 'src/entities/patient.doctor.entity'
import { Session } from 'src/entities/session.entity'
import { Order } from 'src/entities/order.entity'
const crypto = require('crypto')

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>
  @InjectRepository(Therapist)
  private therapistRepository: Repository<Therapist>
  @InjectRepository(Patient)
  private patientRepository: Repository<Patient>
  @InjectRepository(PatientDoctor)
  private patientDoctorRepository: Repository<PatientDoctor>
  @InjectRepository(Session)
  private sessionRepository: Repository<Session>
  @InjectRepository(Order)
  private orderRepository: Repository<Order>

  async findOneBy(fieldValue: { [key: string]: string }): Promise<User | undefined> {
    const field = Object.keys(fieldValue)[0]
    const value = Object.values(fieldValue)[0]
    return this.userRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .leftJoinAndSelect('users.therapist', 'therapist')
      .leftJoinAndSelect('users.patient', 'patient')
      .where(`${field} = :field`, { field: value })
      .getOne()
  }

  async register(registerDto: RegisterDto, skipVerification?: boolean): Promise<User> {
    const password = crypto.createHash('sha256').update(registerDto.password).digest('hex')
    const isSingle = registerDto.isSingle === 'true' ? true : false
    let user = this.userRepository.create({ ...registerDto, password, isSingle })
    user = await this.userRepository.save(user)

    if (!skipVerification) {
      const patient = this.patientRepository.create({
        user,
        details: registerDto['details'],
        newsletter: registerDto['newsletter'],
      })
      await this.patientRepository.save(patient)
    }

    return user
  }

  async validate(verificationDto: VerificationDto) {
    const { verificationCode, email } = verificationDto
    const isMatching = await this.userRepository.findOne({ where: { verificationCode, email } })
    if (isMatching) {
      if (isMatching.isActive) {
        throw new ConflictException('Account is already validated')
      }
      const validatedUser = this.userRepository.merge(isMatching, { isActive: true })
      return this.userRepository.save(validatedUser)
    }
    throw new ConflictException('Invalid verification code or email')
  }

  findOne(whereCondition: any) {
    return this.userRepository.findOneOrFail(whereCondition)
  }

  async updateOne(id: number, updateMeDto: UpdateMeDto | UpdateUserDto) {
    const existingUser = await this.userRepository.findOneOrFail({ where: { id }, relations: ['patient'] })

    if (updateMeDto.hasOwnProperty('newPassword')) {
      if (existingUser.password !== crypto.createHash('sha256').update(updateMeDto.password).digest('hex'))
        throw new BadRequestException('Password mismatch')
      if (updateMeDto.newPassword !== updateMeDto.confirmPassword) throw new BadRequestException('New password mismatch')
      updateMeDto.password = crypto.createHash('sha256').update(updateMeDto.newPassword).digest('hex')
    }
    const patient = { ...existingUser.patient, details: updateMeDto.details, newsletter: updateMeDto.newsletter }
    const user = this.userRepository.merge(existingUser, updateMeDto)
    if (updateMeDto.details && updateMeDto.newsletter !== undefined) {
      await this.patientRepository.save(patient)
      user.patient = patient
    }
    return this.userRepository.save(user)
  }

  getUnreadFormNotifications() {
    return this.userRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.name', 'u.lastName'])
      .where('u.isFormRead = :isFormRead', { isFormRead: false })
      .andWhere('u.role = :role', { role: 'patient' })
      .andWhere('u.isActive = :isActive', { isActive: true })
      .orderBy('u.createdAt', 'DESC')
      .getMany()
  }

  getFormDetails(id: number) {
    return this.userRepository.save({
      id,
      isFormRead: true,
    })
  }

  checkConfirmStatus(id: number) {
    return this.userRepository
      .createQueryBuilder('u')
      .innerJoin('patientsDoctors', 'pd', 'pd.patientId = u.id')
      .innerJoin('sessions', 's', 's.patientDoctorId = pd.id')
      .where('u.id = :id', { id })
      .andWhere('s.isConfirmed = :isConfirmed', { isConfirmed: false })
      .andWhere('u.credit > :credit', { credit: 0 })
      .getCount()
  }

  registerTherapist(registerTherapistDto: RegisterTherapistDto) {
    const therapist = this.therapistRepository.create(registerTherapistDto)
    return this.therapistRepository.save(therapist)
  }

  listPatients(id?: number) {
    return this.userRepository.find({ where: { role: 'patient', ...(id && { id }) } })
  }

  async getPatientsStatistics() {
    const users = await this.userRepository.find({ where: { role: 'patient' }, relations: ['userAsPatient'] })

    const patientsDoctors = await this.patientDoctorRepository.find({ relations: ['doctor'] })

    const userDoctorMap = {}
    const usersReport = []

    for (const pair of patientsDoctors) {
      const { patientId, id } = pair
      if (userDoctorMap[patientId]) {
        if (userDoctorMap[patientId].id < id && patientId === userDoctorMap[patientId].patientId) {
          userDoctorMap[patientId] = pair
        }
      }
      if (!userDoctorMap[patientId]) {
        userDoctorMap[patientId] = pair
      }
    }

    for (let user of users) {
      const doneSessions = await this.sessionRepository
        .createQueryBuilder('s')
        .innerJoin('patientsDoctors', 'pd', 's.patientDoctorId = pd.id')
        .where('done = :done', { done: true })
        .where('pd.patientId = :id', { id: user.id })
        .getCount()

      const doneOrders = await this.orderRepository.createQueryBuilder('o').where('o.userId = :id', { id: user.id }).getCount()

      const nextScheduledSession = await this.sessionRepository.findOne({
        where: {
          id: user.id,
          done: false,
          isConfirmed: false,
        },
      })

      const nextConfirmedSession = await this.sessionRepository.findOne({
        where: {
          id: user.id,
          done: false,
          isConfirmed: true,
        },
      })

      const lastDoneSession = await this.sessionRepository
        .createQueryBuilder('s')
        .innerJoin('patientsDoctors', 'pd', 's.patientDoctorId = pd.id')
        .where('done = :done', { done: true })
        .where('pd.patientId = :id', { id: user.id })
        .orderBy('s.id', 'DESC')
        .limit(1)
        .getOne()

      const lastOrderDone = await this.orderRepository
        .createQueryBuilder('o')
        .where('o.userId = :id', { id: user.id })
        .orderBy('o.id', 'DESC')
        .limit(1)
        .getOne()

      const totalSingleSessionsPurchased = await this.orderRepository
        .createQueryBuilder('o')
        .select('SUM(numberOfSessions) as amount')
        .innerJoin('products', 'p', 'p.id = o.productId')
        .where('p.numberOfSessions = 1')
        .andWhere('o.userId = :id', { id: user.id })
        .getRawOne()

      const totalMultipleSessionsPurchased = await this.orderRepository
        .createQueryBuilder('o')
        .select('SUM(numberOfSessions) as amount')
        .innerJoin('products', 'p', 'p.id = o.productId')
        .where('p.numberOfSessions > 1')
        .andWhere('o.userId = :id', { id: user.id })
        .getRawOne()

      const giftCardsPurchased = await this.orderRepository
        .createQueryBuilder('o')
        .select('Count(id) as amount')
        .where('o.userId = :id', { id: user.id })
        .andWhere('o.giftCard IS NOT NULL')
        .getRawOne()

      const revenue = await this.orderRepository
        .createQueryBuilder('o')
        .select('SUM(paid) as gross, SUM(fee) as tax')
        .where('o.userId = :id', { id: user.id })
        .getRawOne()

      const cost = await this.sessionRepository
        .createQueryBuilder('s')
        .select('SUM(sessionRate) as amount')
        .innerJoin('patientsDoctors', 'pd', 'pd.id = s.patientDoctorId')
        .where('pd.patientId = :id', { id: user.id })
        .getRawOne()

      usersReport.push({
        ...user,
        latestDoctor: userDoctorMap[user.id],
        doneSessions,
        doneOrders,
        nextScheduledSession: nextScheduledSession,
        nextConfirmedSession,
        lastDoneSession,
        lastOrderDone,
        totalPurchasedSessions: user.credit + doneSessions + (nextConfirmedSession ? 1 : 0),
        totalSingleSessionsPurchased,
        totalMultipleSessionsPurchased,
        giftCardsPurchased,
        revenue,
        cost,
      })
    }
    // console.log({ a: JSON.stringify(usersReport) })
    return usersReport
  }

  listDoctors() {
    return this.userRepository.createQueryBuilder('u').innerJoin('therapists', 't', 't.userId = u.id').getMany()
  }

  setDoctorRate({ rate }: { rate: number }, userId: number) {
    return this.therapistRepository.update({ userId: userId }, { rate: rate })
  }
}
