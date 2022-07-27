import { CONSTANTS } from '../app-auth/common/constants'
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, Index, OneToMany, OneToOne } from 'typeorm'
import { BasicEntity } from './basic.entity'
import { PatientDoctor } from './patient.doctor.entity'
import { Therapist } from './therapist.entity'
import { Patient } from './patient.entity'

@Entity('users')
export class User extends BasicEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  email: string

  @Column({ type: 'varchar' })
  lastName: string

  @Column({ type: 'varchar', select: false })
  password: string

  @Column({ type: 'varchar', nullable: true })
  patientProfile: string

  @Column({ type: 'tinyint', default: '0' })
  isActive: boolean

  @Column({ type: 'timestamp', nullable: true })
  birthday: Date

  @Column({ type: 'text', nullable: true })
  form: string

  @Index()
  @Column({ type: 'enum', enum: CONSTANTS.ROLES, default: CONSTANTS.ROLES.PATIENT })
  role: string

  @Column({ type: 'varchar' })
  verificationCode: string

  @Column({ type: 'tinyint', nullable: true })
  isSingle: boolean

  @Column({ type: 'int', default: 1 })
  credit: number

  @Column({ type: 'tinyint', default: false })
  isFormRead: boolean

  @OneToMany(() => PatientDoctor, (patientDoctor) => patientDoctor.patient)
  patients: PatientDoctor[]

  @OneToMany(() => PatientDoctor, (patientDoctor) => patientDoctor.doctor)
  doctors: PatientDoctor[]

  @OneToOne(() => Therapist, (therapist) => therapist.user)
  therapist: Therapist

  @OneToOne(() => Patient, (patient) => patient.user)
  patient: Patient

  @BeforeInsert()
  generateVerificationCode() {
    this.verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
  }
}
