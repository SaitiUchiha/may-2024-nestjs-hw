import { Injectable, NotFoundException } from '@nestjs/common';
import { UserDto, UpdateUserDto, UserResponseDto, UserItemDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { BaseQueryDto } from '../common/validators/base.query.validator';
import { paginateRawAndEntities } from 'nestjs-typeorm-paginate';
import {PaginatedDto} from "../common/interface/response.interface";

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

  async findAll(query?: BaseQueryDto): Promise<PaginatedDto<UserItemDto>> {
    const options = {
      page: query?.page || 1,
      limit: query?.limit || 10,
    };
    const queryBuilder = await this.userRepository.createQueryBuilder('user');

    queryBuilder
        .select('email, "firstName", age, id, "createdAt"')
        .where({ isActive: false });

    if (query?.search) {
      queryBuilder.andWhere(`LOWER("firstName") LIKE '%${query.search}%'`);
    }

    const [pagination, rawEntities] = await paginateRawAndEntities(
        queryBuilder,
        options,
    );

    return {
      page: pagination.meta.currentPage,
      pages: Number(pagination.meta.totalPages),
      countItems: Number(pagination.meta.totalItems),
      entities: rawEntities as [UserItemDto],
    };
  }

  findByID(id: string): Promise<User | null> {
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
