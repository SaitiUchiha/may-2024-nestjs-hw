import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Match } from '../../common/decorators/password.decorator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  @Transform(({ value }) => value.trim())
  email: string;
  @IsString()
  @Matches(/^\S*(?=\S{8,})(?=\S*[A-Z])(?=\S*[\d])\S*$/, {
    message: 'Password must have 1 upper case',
  })
  @IsNotEmpty()
  password: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  firstName: string;
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  age: number;
  @ApiProperty({
    default: 'Lviv',
    required: false,
    description: 'City User lives in',
  })
  @IsOptional()
  city: string;
}

export class ForgotPassword {
  @IsString()
  @Matches(/^\S*(?=\S{8,})(?=\S*[A-Z])(?=\S*[\d])\S*$/, {
    message: 'Password must have 1 upper case',
  })
  password: string;
  @Match('password', { message: 'Password must match' })
  repeatPassword: string;
}

export class UserResponseDto extends IntersectionType(UserDto) {
  id: number;
  status: boolean;
}

export class UpdateUserDto {
  email: string;
  password: string;
  firstName: string;
  city: string;
  age: number;
}

export class UserQueryDto {
  @ApiProperty({ required: true })
  limit: string;
  @ApiProperty({ required: false })
  sort: string;
  @ApiProperty({ required: true })
  page: string;
}

export class SingUpDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  createdAt: Date;
}