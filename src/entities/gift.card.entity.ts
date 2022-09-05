import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BasicEntity } from './basic.entity'

@Entity('giftCards')
export class GiftCard extends BasicEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  price: number

  @Column({ type: 'timestamp' })
  from: Date

  @Column({ type: 'timestamp' })
  until: Date

  @Column({ type: 'varchar' })
  code: string

  @Column({ type: 'timestamp', nullable: true })
  redemptionDate: Date

  @BeforeInsert()
  generatePromoCode() {
    this.code = Math.floor(10000000 + Math.random() * 90000000).toString()
  }
}
