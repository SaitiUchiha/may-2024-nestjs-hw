import { ApiProperty, IntersectionType } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  email: string;
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  title: string;
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  body: string;
}

export class PostResponseDto extends IntersectionType(PostDto) {
  id: number;
  status: boolean;
}

export class UpdatePostDto {
  email: string;
  password: string;
  title: string;
  body: string;
}

export class PostQueryDto {
  @ApiProperty({ required: true })
  limit: string;
  @ApiProperty({ required: false })
  sort: string;
  @ApiProperty({ required: true })
  page: string;
}
