import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
class UserDto {
  readonly name: string
  readonly lastName: string
  readonly patientProfile: boolean
  readonly birthDate: string
}

export class LoginResponseDto {
  token: string
  @Type(() => UserDto)
  @ValidateNested()
  readonly user: UserDto
}
