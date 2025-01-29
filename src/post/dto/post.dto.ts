import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserDto } from '../../user/dto/user.dto';

export class PostDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  body: string;
}


export class UserResponseDto extends IntersectionType(UserDto) {
  id: number;
  favorites: boolean;
}

export class UpdatePostDto {
  title: string;
  description: string;
  body: string;
}
