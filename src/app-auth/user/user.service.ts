import { ConflictException, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { RegisterDto } from '../auth/dto/register.dto'
import { VerificationDto } from '../auth/dto/verification.dto'
import { UpdateMeDto } from './dto/update-me.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { RegisterTherapistDto } from '../auth/dto/register-therapist.dto'
import { Therapist } from 'src/entities/therapist.entity'
const crypto = require('crypto')

@Injectable()
export class UserService {
  @InjectRepository(User)
  private usersRepository: Repository<User>
  @InjectRepository(Therapist)
  private therapistRepository: Repository<Therapist>

  async findOneBy(fieldValue: { [key: string]: string }): Promise<User | undefined> {
    const field = Object.keys(fieldValue)[0]
    const value = Object.values(fieldValue)[0]
    return this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .leftJoinAndSelect('users.therapist', 'therapist')
      .leftJoinAndSelect('users.patient', 'patient')
      .where(`${field} = :field`, { field: value })
      .getOne()
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const password = crypto.createHash('sha256').update(registerDto.password).digest('hex')
    const isSingle = registerDto.isSingle === 'true' ? true : false
    const user = this.usersRepository.create({ ...registerDto, password, isSingle })
    return this.usersRepository.save(user)
  }

  async validate(verificationDto: VerificationDto) {
    const { verificationCode, email } = verificationDto
    const isMatching = await this.usersRepository.findOne({ where: { verificationCode, email } })
    if (isMatching) {
      if (isMatching.isActive) {
        throw new ConflictException('Account is already validated')
      }
      const validatedUser = this.usersRepository.merge(isMatching, { isActive: true })
      return this.usersRepository.save(validatedUser)
    }
    throw new ConflictException('Invalid verification code or email')
  }

  findOne(whereCondition: any) {
    return this.usersRepository.findOneOrFail(whereCondition)
  }

  async updateOne(id: number, updateMeDto: UpdateMeDto | UpdateUserDto) {
    const existingUser = await this.usersRepository.findOneOrFail({ where: { id } })
    if (updateMeDto.hasOwnProperty('password')) {
      updateMeDto.password = crypto.createHash('sha256').update(updateMeDto.password).digest('hex')
    }
    const user = this.usersRepository.merge(existingUser, updateMeDto)
    return this.usersRepository.save(user)
  }

  getUnreadFormNotifications() {
    return this.usersRepository
      .createQueryBuilder('u')
      .select(['u.id', 'u.name', 'u.lastName'])
      .where('u.isFormRead = :isFormRead', { isFormRead: false })
      .andWhere('u.role = :role', { role: 'patient' })
      .andWhere('u.isActive = :isActive', { isActive: true })
      .orderBy('u.createdAt', 'DESC')
      .getMany()
  }

  getFormDetails(id: number) {
    return this.usersRepository.save({
      id,
      isFormRead: true,
    })
  }

  checkConfirmStatus(id: number) {
    return this.usersRepository
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
}
