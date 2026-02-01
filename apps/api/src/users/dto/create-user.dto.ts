import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @MinLength(6)
  password: string;
}
