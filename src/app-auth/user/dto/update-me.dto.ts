import { Allow, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class UpdateMeDto {
  @Allow()
  birthday: string
  @Allow()
  patientProfile: string
  @Allow()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsOptional()
  password?: string
  @Allow()
  lastName: string
  @Allow()
  name: string
  @Allow()
  details: string
  @Allow()
  newsletter: boolean
  @Allow()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsOptional()
  newPassword?: string
  @Allow()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsOptional()
  confirmPassword?: string
  @Allow()
  @IsString()
  @IsOptional()
  oldPassword?: string
}
