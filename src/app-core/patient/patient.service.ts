import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Patient } from 'src/entities/patient.entity'
import { PatientDoctor } from 'src/entities/patient.doctor.entity'

@Injectable()
export class PatientService {
  @InjectRepository(Patient)
  private patientRepository: Repository<Patient>
  @InjectRepository(PatientDoctor)
  private patientDoctorRepository: Repository<PatientDoctor>

  uploadConsent(id: number, consent: string) {
    return this.patientRepository.update(id, { consent })
  }

  getLatestTherapist(id: number) {
    return this.patientRepository
      .createQueryBuilder('p')
      .select(['t.*'])
      .innerJoin('patientsDoctors', 'pd', 'pd.patientId = p.userId')
      .innerJoin('therapists', 't', 't.userId = pd.doctorId')
      .where('p.userId = :id', { id })
      .orderBy('pd.id', 'DESC')
      .limit(1)
      .getRawOne()
  }

  async updateNotes(doctorId: number, patientId: number, notes: string) {
    await this.patientDoctorRepository.findOneOrFail({ where: { patientId, doctorId } })
    return this.patientRepository.update({ userId: patientId }, { notes })
  }
}
