import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BasicEntity } from './basic.entity'

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

  @Column({ type: 'int' })
  tax: number

  @Column({ type: 'tinyint' })
  status: boolean

  @Column({ type: 'timestamp' })
  from: Date

  @Column({ type: 'timestamp' })
  until: Date
}
