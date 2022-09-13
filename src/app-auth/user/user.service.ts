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
    let latestPatientsDoctorsIds = await this.patientDoctorRepository.createQueryBuilder('pd').select('MAX(id) as id, pd.patientId').getRawMany()

    latestPatientsDoctorsIds = latestPatientsDoctorsIds.map((entry) => entry.id)

    return this.userRepository
      .createQueryBuilder('u')
      .innerJoinAndSelect('patients', 'p', 'p.userId = u.id')
      .leftJoinAndSelect('patientsDoctors', 'pd', 'pd.patientId = u.id')
      .where(`${latestPatientsDoctorsIds.length ? `pd.id In (${latestPatientsDoctorsIds.join(',')})` : true}`)
      .innerJoinAndSelect('users', 'u2', 'u2.id = pd.doctorId')
      .getRawMany()
  }
}
