import { Injectable, NotFoundException } from '@nestjs/common';
import {
  UserDto,
  UpdateUserDto,
  UserQueryDto,
  UserResponseDto,
} from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';

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

  findAll() {
    return this.usersList as UserResponseDto[];
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
