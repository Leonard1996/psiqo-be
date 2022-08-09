import { Allow } from 'class-validator'

export class UpdateUserDto {
  @Allow()
  isActive: boolean
  password?: string
  details?: string
  newsletter?: boolean
  newPassword?: string
  confirmPassword?: string
}
