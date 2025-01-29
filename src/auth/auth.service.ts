import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserDto } from '../user/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signUpUser(body: UserDto) {
    const findUser = await this.userRepository.findOne({
      where: { email: body.email },
    });
    if (findUser) {
      throw new BadRequestException(
        `User already exists with email: ${findUser.email}`,
      );
    }
    const password = await bcrypt.hash(body.password, 10);
    const user: User = await this.userRepository.save(
      this.userRepository.create({
        ...body,
        password,
      }),
    );
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
