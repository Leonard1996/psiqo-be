import { Allow, IsBoolean } from 'class-validator'

export class UpdatePromoCodeDto {
  @Allow()
  @IsBoolean()
  status: boolean
}
