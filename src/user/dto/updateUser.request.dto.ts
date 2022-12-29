import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  public password: string;

  @IsOptional()
  @IsString()
  public userName: string;

  @IsOptional()
  @IsString()
  public phoneNumber: string;

  @IsOptional()
  @IsString()
  public address: string;
}
