import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { Patient } from 'src/entities/patient.entity'

@Injectable()
export class PatientService {
  @InjectRepository(Patient)
  private patientRepository: Repository<Patient>

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
}
