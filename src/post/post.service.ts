import { Injectable, NotFoundException } from '@nestjs/common';
import { PostDto, UpdatePostDto, PostResponseDto } from './dto/post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../database/entities/post.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  private postsList: any[] = [];

  create(createPostDto: PostDto) {
    const index = new Date().valueOf();
    this.postsList.push({
      ...createPostDto,
      id: index,
    });
    return this.postsList[0] as PostResponseDto;
  }

  findAll() {
    return this.postsList as PostResponseDto[];
  }

  findPostByID(id: string): Promise<Post | null> {
    return this.postRepository.findOneBy({ id: id });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      const editedPost = await this.postRepository.findOneBy({ id: id });

      if (!editedPost) {
        throw new NotFoundException('Post not found');
      }

      editedPost.firstName = updatePostDto.firstName;
      editedPost.body = updatePostDto.body;
      editedPost.email = updatePostDto.email;

      await this.postRepository.save(editedPost);

      return editedPost;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.postRepository.delete({ id: id });
  }
}
