import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty, IsEnum } from 'class-validator';
import { UserRole } from '../../users/user.entity';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsEnum(UserRole, { message: 'Invalid user role' })
  role: UserRole = UserRole.USER;
}
