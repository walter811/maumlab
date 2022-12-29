import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  public password: string;

  @IsString()
  @IsNotEmpty()
  public userName: string;

  @IsString()
  @IsNotEmpty()
  public phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  public address: string;
}
