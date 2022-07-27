import { IsString, MinLength, MaxLength, IsEmail, IsNotEmpty } from 'class-validator'

export class RegisterDto {
  @IsNotEmpty()
  name: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsNotEmpty()
  lastName: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string

  @IsNotEmpty()
  confirmPassword: string

  patientProfile?: string

  @IsNotEmpty()
  birthday: string

  @IsNotEmpty()
  form: string

  isSingle?: string

  role?:string
}
