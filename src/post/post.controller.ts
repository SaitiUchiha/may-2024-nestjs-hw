import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto, PostQueryDto, PostResponseDto } from './dto/post.dto';
import { UpdatePostDto } from './dto/post.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiResponse({ status: HttpStatus.CREATED, type: PostDto })
  @Post('/create')
  createPost(@Body() createPostDto: PostResponseDto) {
    return this.postService.create(createPostDto);
  }

  @Get('/list')
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOnePost(@Param('id') id: string) {
    return this.postService.findPostByID(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
