import { HttpException, Injectable, NotFoundException } from '@nestjs/common'
import { Connection, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Session } from 'src/entities/session.entity'
import { CreateSessionDto } from './dto/create.session-dto'
import { User } from 'src/entities/user.entity'
import { PatientDoctor } from 'src/entities/patient.doctor.entity'

@Injectable()
export class SessionService {
  constructor(private connection: Connection) {}

  @InjectRepository(Session)
  private sessionRepository: Repository<Session>
  @InjectRepository(User)
  private userRepository: Repository<User>
  @InjectRepository(PatientDoctor)
  private patientDoctorRepository: Repository<PatientDoctor>

  getDoctorAgenda(doctorId: number, month: number) {
    month = Number(month) || Number(new Date().getMonth() + 1)
    return this.sessionRepository
      .createQueryBuilder('s')
      .select('s.*, u.name, u.lastName')
      .innerJoin('patientsDoctors', 'pd', 'pd.id = s.patientDoctorId')
      .innerJoin('users', 'u', 'u.id = pd.patientId')
      .where('s.month = :month', { month })
      .andWhere('pd.doctorId = :doctorId', { doctorId })
      .getRawMany()
  }

  getNextConfirmedSession(doctorId: number) {
    return this.sessionRepository
      .createQueryBuilder('s')
      .select('s.startTime, u.name, u.lastName')
      .innerJoin('patientsDoctors', 'pd', 'pd.id = s.patientDoctorId')
      .innerJoin('users', 'u', 'u.id = pd.patientId')
      .where('pd.doctorId = :doctorId', { doctorId })
      .andWhere('s.isConfirmed = :isConfirmed', { isConfirmed: true })
      .orderBy('s.id', 'ASC')
      .limit(1)
      .getRawOne()
  }

  async create(createSessionDto: CreateSessionDto, doctorId: number) {
    const { id } = await this.patientDoctorRepository.findOneOrFail({ where: { doctorId, patientId: createSessionDto.patientId } })
    const session = this.sessionRepository.create({ ...createSessionDto, patientDoctorId: id })
    return this.sessionRepository.save(session)
  }

  async confirm(userId: number) {
    const queryRunner = this.connection.createQueryRunner()
    await queryRunner.connect()

    const unconfirmedSession = await this.sessionRepository
      .createQueryBuilder('s')
      .select('s.id as sessionId, u.name as patientName, s.link, s.startTime, s.endTime')
      .innerJoin('patientsDoctors', 'pd', 'pd.id = s.patientDoctorId')
      .innerJoin('users', 'u', 'u.id = pd.patientId')
      .where('s.isConfirmed = :isConfirmed', { isConfirmed: false })
      .andWhere('u.id = :userId', { userId })
      .getRawOne()

    if (!unconfirmedSession) throw new NotFoundException('Session does not exist')

    let result: boolean = false
    try {
      await queryRunner.startTransaction()
      await queryRunner.manager
        .getRepository(User)
        .createQueryBuilder('users')
        .update(User)
        .set({ credit: () => 'users.credit - 1' })
        .where('id = :userId', { userId })
        .andWhere('users.credit > 0')
        .execute()

      await this.sessionRepository.update({ id: unconfirmedSession.sessionId }, { isConfirmed: true })

      await queryRunner.commitTransaction()
      result = true
    } catch (err) {
      await queryRunner.rollbackTransaction()
    } finally {
      await queryRunner.release()
      if (result) return unconfirmedSession
      throw new HttpException('Payment Required', 402)
    }
  }

  validateSession(id: number, link: string) {
    return this.sessionRepository.findOneOrFail({ where: { id, link } })
  }

  delete(id: number) {
    return this.sessionRepository.delete({ id, isConfirmed: false })
  }

  getSessionDetails(id: number) {
    return this.sessionRepository
      .createQueryBuilder('s')
      .select('p.name as name, p.email as email, s.*, d.name as doctorName')
      .innerJoin('patientsDoctors', 'pd', 'pd.id = s.patientDoctorId')
      .innerJoin('users', 'p', 'p.id = pd.patientId')
      .innerJoin('users', 'd', 'd.id = pd.doctorId')
      .where('s.id = :id', { id })
      .getRawOne()
  }

  getAllSessionsPerDoctor(doctorId: number, year: number) {
    return this.sessionRepository
      .createQueryBuilder('s')
      .select('COUNT(s.id) as amount, s.isConfirmed, s.month, s.done')
      .innerJoin('patientsDoctors', 'pd', 'pd.id = s.patientDoctorId')
      .where('pd.doctorId = :doctorId', { doctorId })
      .andWhere('s.createdAt > :startDate', { startDate: new Date(year, 0, 0) })
      .andWhere('s.createdAt < :endDate', { endDate: new Date(year + 1, 0, 1) })
      .groupBy('month, isConfirmed, done')
      .getRawMany()
  }

  getPatients(doctorId: number, name: string) {
    return this.userRepository
      .createQueryBuilder('u')
      .select('u2.*, p.*')
      .innerJoin('patientsDoctors', 'pd', 'pd.doctorId = u.id')
      .innerJoin('users', 'u2', 'u2.id = pd.patientId')
      .innerJoin('patients', 'p', 'p.userId = u2.id')
      .where('pd.doctorId = :doctorId', { doctorId })
      .andWhere(`${name?.length ? `concat(u2.name,u2.lastName) LIKE '%${name}%'` : true}`)
      .getRawMany()
  }
}
