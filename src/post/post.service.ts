import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PostDto,
  UpdatePostDto,
  PostQueryDto,
  PostResponseDto,
} from './dto/post.dto';

@Injectable()
export class PostService {
  private postsList: any[] = [];
  create(createPostDto: PostDto) {
    const index = new Date().valueOf();
    this.postsList.push({
      ...createPostDto,
      id: index,
    });
    return this.postsList[0] as PostResponseDto;
  }

  findAll(data: PostQueryDto) {
    return this.postsList as PostResponseDto[];
  }

  findOne(id: number) {
    return this.postsList.find((post) => post.id === id);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<PostDto> {
    const post:PostDto = await this.findOne(id);
    const newPost = updatePostDto;
    post.firstName = newPost.firstName;
    post.body = newPost.body;
    return post;
  }

  async remove(id: number): Promise<void> {
    const post = await this.postsList.find((post) => post.id === id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    delete post.id;
  }
}
