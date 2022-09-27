import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BasicEntity } from './basic.entity'
import { Product } from './product.entity'
import { User } from './user.entity'

@Entity('orders')
export class Order extends BasicEntity {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Product, (product) => product.orders)
  @JoinColumn({ name: 'productId' })
  product: Product

  @Column('varchar', { nullable: true })
  purchaserType: string

  @Column('int')
  productId: number

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'userId' })
  user: User

  @Column('int')
  userId: number

  @Column('varchar', { nullable: true })
  sessionType: string

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  paid: number

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  fee: number

  @Column({ type: 'json', nullable: true })
  details: string

  @Column('varchar', { nullable: true })
  promoCode: string

  @Column('varchar', { nullable: true })
  giftCard: string
}
