import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BasicEntity } from './basic.entity'
import { User } from './user.entity'

const enum PROMO_CODE_NAMES {
  WELCOME = 'welcome',
  DISCOUNT = 'discount',
}

@Entity('promoCodes')
export class PromoCode extends BasicEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  name: PROMO_CODE_NAMES

  @Column({ type: 'varchar' })
  type: string

  @Column({ type: 'int' })
  numberOfSessions: number

  @Column({ type: 'int' })
  flatDiscount: number

  @Column({ type: 'int' })
  percentageDiscount: number

  @Column({ type: 'tinyint' })
  status: boolean

  @Column({ type: 'timestamp' })
  from: Date

  @Column({ type: 'timestamp' })
  until: Date

  @Column({ type: 'varchar' })
  usability: string

  @ManyToOne(() => User, (user) => user.promoCodes)
  user: User

  @Column({ type: 'int', nullable: true })
  userId: number

  @Column({ type: 'varchar' })
  code: string

  @BeforeInsert()
  generatePromoCode() {
    this.code = Math.floor(10000000 + Math.random() * 90000000).toString()
  }
}
