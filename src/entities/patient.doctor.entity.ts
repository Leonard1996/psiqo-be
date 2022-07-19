import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BasicEntity } from './basic.entity'
import { Session } from './session.entity'
import { User } from './user.entity'

@Entity('patientsDoctors')
@Index(["patient", "doctor"], { unique: true })
export class PatientDoctor extends BasicEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => User, (user) => user.patients, { cascade: true })
    @JoinColumn({ name: 'patientId' })
    patient: User

    @ManyToOne(() => User, (user) => user.doctors, { cascade: true })
    @JoinColumn({ name: 'doctorId' })
    doctor: User

    @Column({ name: 'patientId', nullable: true })
    patientId: number

    @Column({ name: 'doctorId', nullable: true })
    doctorId: number

    @OneToMany(() => Session, (session) => session.patientDoctor)
    sessions: Session[]
}
