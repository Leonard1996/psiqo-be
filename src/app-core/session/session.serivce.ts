import { HttpException, Injectable, NotFoundException } from '@nestjs/common'
import { Connection, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Session } from 'src/entities/session.entity'
import { CreateSessionDto } from './dto/create.session-dto'
import { UserService } from 'src/app-auth/user/user.service'
import { User } from 'src/entities/user.entity'

@Injectable()
export class SessionService {
    constructor(private connection: Connection, private userService: UserService) { }

    @InjectRepository(Session)
    private sessionRepository: Repository<Session>

    getDoctorAgenda(doctorId: number, month: number) {
        month = Number(month) || Number(new Date().getMonth() + 1)
        return this.sessionRepository
            .createQueryBuilder('s')
            .innerJoin('patientsDoctors', 'pd', 'pd.id = s.patientDoctorId')
            .where('s.month = :month', { month })
            .andWhere('pd.doctorId = :doctorId', { doctorId })
            .getMany()
    }

    create(createSessionDto: CreateSessionDto) {
        const session = this.sessionRepository.create(createSessionDto)
        return this.sessionRepository.save(session)
    }

    async confirm(userId: number) {

        const queryRunner = this.connection.createQueryRunner()
        await queryRunner.connect()

        const unconfirmedSession = await this.sessionRepository.createQueryBuilder('s')
            .select('s.id as sessionId, u.name as patientName, s.link, s.startTime, s.endTime')
            .innerJoin('patientsDoctors', 'pd', 'pd.id = s.patientDoctorId')
            .innerJoin('users', 'u', 'u.id = pd.patientId')
            .where('s.isConfirmed = :isConfirmed', { isConfirmed: false })
            .andWhere('u.id = :userId', { userId })
            .getRawOne();

        if (!unconfirmedSession) throw new NotFoundException("Session does not exist");

        let result: boolean = false;
        try {
            await queryRunner.startTransaction()
            await queryRunner.manager.getRepository(User)
                .createQueryBuilder('users')
                .update(User)
                .set({ credit: () => "users.credit - 1" })
                .where("id = :userId", { userId })
                .andWhere('users.credit > 0')
                .execute()

            await this.sessionRepository.update({ id: unconfirmedSession.sessionId }, { isConfirmed: true })

            await queryRunner.commitTransaction();
            result = true;
        } catch (err) {

            await queryRunner.rollbackTransaction()
        }
        finally {

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
        return this.sessionRepository.createQueryBuilder('s')
            .select('p.name as name, p.email as email, s.*, d.name as doctorName')
            .innerJoin('patientsDoctors', 'pd', 'pd.id = s.patientDoctorId')
            .innerJoin('users', 'p', 'p.id = pd.patientId')
            .innerJoin('users', 'd', 'd.id = pd.doctorId')
            .where('s.id = :id', { id })
            .getRawOne();
    }
}
