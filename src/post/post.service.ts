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

  async create(createPostDto: PostDto) {
    try {
      const post = await this.postRepository.save(
        this.postRepository.create({
          ...createPostDto,
          user_id: '31c3b9b1-934a-4bbb-8039-7241f4852f17',
        }),
      );
      return post;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException('Creat post failed.');
    }
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

      editedPost.title = updatePostDto.title;
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
