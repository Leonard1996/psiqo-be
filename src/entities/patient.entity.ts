import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BasicEntity } from './basic.entity'
import { User } from './user.entity'

const STATUSES = {
  LEAD: 'lead',
  REGISTRATO: 'registrato',
  FREE_TRIAL: 'free trial',
  NON_PAGANTE: 'non pagante',
  ATTIVO: 'attivo',
  INATTIVO: 'inattivo',
  ACQUISTO_SENZA_REGISTRAZIONE: 'acquisto senza egistrazione',
}

const FREE_TRIAL = {
  DA_PROGRAMMARE: 'da programmare',
  DA_CONFERMARE: 'da confermare',
  SI: 'si',
  SCADUTO: 'scaduto',
  NO_SHOW: 'no show',
}

@Entity('patients')
export class Patient extends BasicEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  userId: number

  @Column({ type: 'json' })
  details: string

  @OneToOne(() => User, (user) => user.patient)
  @JoinColumn()
  user: User

  @Column({ type: 'varchar', default: STATUSES.REGISTRATO })
  status: string

  @Column({ type: 'varchar', default: FREE_TRIAL.DA_PROGRAMMARE })
  freeTrial: string

  @Column({ type: 'varchar', nullable: true })
  consent: string

  @Column({ type: 'tinyint', default: false })
  newsletter: boolean
}
