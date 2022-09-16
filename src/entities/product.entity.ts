import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BasicEntity } from './basic.entity'
import { Order } from './order.entity'

@Entity('products')
export class Product extends BasicEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  typeOfSession: string

  @Column({ type: 'int' })
  numberOfSessions: number

  @Column({ type: 'int' })
  price: number

  @Column({ type: 'int', nullable: true })
  tax: number

  @Column({ type: 'tinyint' })
  status: boolean

  @Column({ type: 'timestamp' })
  from: Date

  @Column({ type: 'timestamp' })
  until: Date

  @OneToMany(() => Order, (order) => order.product)
  orders: Order[]
}
