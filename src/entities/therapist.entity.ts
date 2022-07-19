import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BasicEntity } from './basic.entity'
import { User } from './user.entity'

@Entity('therapists')
export class Therapist extends BasicEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar" })
    cv: string

    @Column({ type: "int" })
    userId: number

    @Column({ type: "json" })
    details: string

    @OneToOne(() => User, (user) => user.therapists)
    @JoinColumn()
    user: User
}
