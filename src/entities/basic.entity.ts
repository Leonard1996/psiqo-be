import { CreateDateColumn, UpdateDateColumn } from 'typeorm'

export class BasicEntity {
  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date
}
