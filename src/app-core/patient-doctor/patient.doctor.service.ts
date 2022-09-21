import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { PatientDoctor } from '../../entities/patient.doctor.entity'
import { CreatePatientDoctorDto } from './dto/create-patient-doctor.dto'

@Injectable()
export class PatientDoctorService {
  @InjectRepository(PatientDoctor)
  private patientDoctorRepository: Repository<PatientDoctor>

  create(createPatientDoctorDto: CreatePatientDoctorDto) {
    const patientDoctor = this.patientDoctorRepository.create(createPatientDoctorDto)
    return this.patientDoctorRepository.save(patientDoctor)
  }

  delete(id: number) {
    return this.patientDoctorRepository.delete(id)
  }

  findOneWithDetails(id: number) {
    return this.patientDoctorRepository
      .createQueryBuilder('pd')
      .select('doctors.name As doctorName, patients.name, patients.id, patients.email, doctors.id as doctorId')
      .innerJoin('users', 'doctors', 'doctors.id = pd.doctorId')
      .innerJoin('users', 'patients', 'patients.id = pd.patientId')
      .where('pd.id = :id', { id })
      .getRawOne()
  }

  getLatestByPatientId(patientId: string) {
    return this.patientDoctorRepository
      .createQueryBuilder('pd')
      .where('pd.patientId = :patientId', { patientId })
      .orderBy('id', 'DESC')
      .limit(1)
      .getOne()
  }
}
