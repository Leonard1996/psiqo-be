import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BasicEntity } from './basic.entity'
import { PatientDoctor } from './patient.doctor.entity'

@Entity('sessions')
export class Session extends BasicEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => PatientDoctor, (patientDoctor) => patientDoctor.sessions, { cascade: true })
  @JoinColumn({ name: 'patientDoctorId' })
  patientDoctor: PatientDoctor

  @Column({ name: 'patientDoctorId' })
  patientDoctorId: number

  @Column({ type: 'timestamp' })
  startTime: Date

  @Column({ type: 'timestamp' })
  endTime: Date

  @Column({ type: 'tinyint', default: false })
  isConfirmed: boolean

  @Index()
  @Column({ type: 'int' })
  month: number

  @Index()
  @Column({ type: 'varchar', nullable: true })
  link: string

  @Column({ type: 'text', nullable: true })
  notes: string

  @Index()
  @Column({ type: 'tinyint', default: false })
  done: boolean

  @Column({ type: 'int', nullable: true })
  sessionRate: number
}
