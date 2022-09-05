import { Allow } from 'class-validator'

export default class CreateGiftCardDto {
  @Allow()
  price: number
  @Allow()
  from: Date
  @Allow()
  until: Date
}
