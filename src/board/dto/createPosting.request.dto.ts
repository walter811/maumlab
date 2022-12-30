import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostingDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
