import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PostDto, UpdatePostDto } from './dto/post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { BaseQueryDto } from '../common/validators/base.query.validator';
import { Post } from '../database/entities/post.entity';

@Injectable()
export class PostService {
  private logger: Logger;
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}
  async create(data: PostDto) {
    try {
      const post = await this.postRepository.save(
        this.postRepository.create({
          ...data,
          user_id: '9e50a1c4-0880-4cd4-9813-965b2eaa6c17',
        }),
      );
      return post;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException('Creation of the post failed.');
    }
  }

  async findAll(query?: BaseQueryDto): Promise<any> {
    const options = {
      page: query?.page || 1,
      limit: query?.limit || 10,
    };

    const [entities, total] = await this.postRepository.findAndCount({
      select: {
        title: true,
        description: true,
        id: true,
      },
      relations: {
        user: true,
      },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    });

    return {
      page: options.page,
      pages: Math.ceil(total / options.limit),
      countItems: total,
      entities: entities,
    };
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
      editedPost.description = updatePostDto.description;
      editedPost.body = updatePostDto.body;

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
