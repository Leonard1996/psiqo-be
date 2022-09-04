import { Allow } from 'class-validator'

export class CreatePromoCodeDto {
  @Allow()
  name: string
  @Allow()
  type: string
  @Allow()
  numberOfSessions: number
  @Allow()
  flatDiscount: number
  @Allow()
  percentageDiscount: number
  @Allow()
  status: boolean
  @Allow()
  from: Date
  @Allow()
  until: Date
  @Allow()
  usability: string
  @Allow()
  userId?: number
}
