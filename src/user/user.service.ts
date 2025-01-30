import { Injectable, NotFoundException } from '@nestjs/common';
import {
  UserDto,
  UpdateUserDto,
  UserResponseDto,
  UserItemDto,
} from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { BaseQueryDto } from '../common/validators/base.query.validator';
import { paginateRawAndEntities } from 'nestjs-typeorm-paginate';
import { PaginatedDto } from '../common/interface/response.interface';
import { PATH_TO_IMAGE } from '../common/utils/upload.utils';
import * as fs from 'node:fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private usersList: any[] = [];

  create(createUserDto: UserDto) {
    const index = new Date().valueOf();
    this.usersList.push({
      ...createUserDto,
      id: index,
    });
    return this.usersList[0] as UserResponseDto;
  }

  async findAll(query?: BaseQueryDto): Promise<any> {
    const options = {
      page: query?.page || 1,
      limit: query?.limit || 10,
    };
    // простий варіант виведення даних з великим кодом
    // const queryBuilder = await this.userRepository.createQueryBuilder('user');
    // queryBuilder
    //
    //   .select('email, "firstName", age, id, "createdAt"')
    //   .where({ isActive: false });
    //
    // if (query?.search) {
    //   queryBuilder.andWhere(`LOWER("firstName") LIKE '%${query.search}%'`);
    // }
    //
    // const [pagination, rawEntities] = await paginateRawAndEntities(
    //   queryBuilder,
    //   options,
    // );
    // return {
    //
    //   page: pagination.meta.currentPage,
    //   pages: Number(pagination.meta.totalPages),
    //   countItems: Number(pagination.meta.totalItems),
    //   entities: rawEntities as [UserItemDto],
    // };

    // трохи важчий варіант виведення даних з великим кодом
    // const queryBuilder = await this.userRepository
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.posts', 'post')
    //   .where('"isActive" = false')
    //   .skip((options.page - 1) * options.limit)
    //   .take(options.limit);
    // const total = await queryBuilder.getCount();
    // return {
    //   page: options.page,
    //   pages: Math.ceil( total / options.limit),
    //   countItems:  total,
    //   entities: await queryBuilder.getMany(),
    // };

    const [entities, total] = await this.userRepository.findAndCount({
      where: { isActive: false },
      select: {
        email: true,
        firstName: true,
        id: true,
      },
      relations: {
        posts: true,
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

  findByID(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id: id });
  }

  uploadOneImgByID(id: string, fileName: any): Promise<User | null> {
    if (fileName) {
      const avatarPath = `${PATH_TO_IMAGE}/${fileName}`;
      console.log(avatarPath); /// { avatar: avatarPath }
    }
    return this.userRepository.findOneBy({ id: id });
  }

  uploadManyImgByID(id: string, body: any): Promise<User | null> {
    return this.userRepository.findOneBy({ id: id });
  }

  deleteImgByID(id: string, body: any): Promise<User | null> {
    try {
      fs.unlinkSync(`./upload.${PATH_TO_IMAGE}/gallery/${body.filename}`);
    } catch (err) {
      console.log(err);
    }
    return this.userRepository.findOneBy({ id: id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const editedUser = await this.userRepository.findOneBy({ id: id });

      if (!editedUser) {
        throw new NotFoundException('User not found');
      }

      editedUser.firstName = updateUserDto.firstName;
      editedUser.age = updateUserDto.age;
      editedUser.email = updateUserDto.email;

      await this.userRepository.save(editedUser);

      return editedUser;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ id: id });
  }
}
