import { Allow } from 'class-validator'

export class CreateProductDto {
  @Allow()
  name: string
  @Allow()
  typeOfSession: string
  @Allow()
  numberOfSessions: number
  @Allow()
  price: number
  @Allow()
  tax: number
  @Allow()
  status: boolean
  @Allow()
  from: Date
  @Allow()
  until: Date
}
