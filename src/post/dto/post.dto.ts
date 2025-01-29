import { ApiProperty, IntersectionType } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({ required: true })
  email: string;
  @ApiProperty({ required: true })
  password: string;
  @ApiProperty({ required: false })
  firstName: string;
  @ApiProperty({ required: true })
  body: string;
}

export class PostResponseDto extends IntersectionType(PostDto) {
  id: number;
  status: boolean;
}

export class UpdatePostDto {
  email: string;
  password: string;
  firstName: string;
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
