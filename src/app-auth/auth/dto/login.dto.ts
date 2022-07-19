import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  public email: string

  @IsString()
  @IsNotEmpty()
  public password: string
}
