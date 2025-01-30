import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';

import { AuthDto, UpdateAuthDto } from './dto/auth.dto';
import { User } from '../database/entities/user.entity';
import { BaseQueryDto } from '../common/validators/base.query.validator';

@Injectable()
export class AuthService {
  private redisUserKey = 'user-token';
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRedisClient() private readonly redisClient: RedisClient,
    private readonly jwtService: JwtService,
  ) {}

  async signUpUser(body: AuthDto): Promise<{ accessToken: string }> {
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

    const token = await this.singIn(user.id, user.email);

    // await this.redisClient.setEx(this.redisUserKey, 2 * 60, JSON.stringify(user));
    await this.redisClient.setEx(
      `${this.redisUserKey}-${user.id}`,
      24 * 60 * 60,
      token,
    );

    // //logout
    // await this.redisClient.del(`${this.redisUserKey}-${user.id}`);

    // // @ts-ignore
    // const userInRedis = JSON.parse(await this.redisClient.get(this.redisUserKey));
    // // @ts-ignore
    // const userInRedis2 = JSON.parse(await this.redisClient.del('user'));
    // console.log(userInRedis, userInRedis2);

    return { accessToken: token };
    // {
    //   id: user.id,
    //   email: user.email,
    //   createdAt: user.createdAt,
    // };
  }

  async validateUser(userId: string, userEmail: string): Promise<User | null> {
    if (!userId || !userEmail) {
      throw new UnauthorizedException();
    }
    const user = this.userRepository.findOne({
      where: {
        id: userId,
        email: userEmail,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async singIn(userId: string, userEmail: string): Promise<string> {
    return this.jwtService.sign({ id: userId, email: userEmail });
  }

  async findAllAuth(query?: BaseQueryDto): Promise<any> {
    const options = {
      page: query?.page || 1,
      limit: query?.limit || 10,
    };

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

  findAuthByID(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id: id });
  }

  async updateAuth(id: string, updateAuthDto: UpdateAuthDto) {
    try {
      const editedUser = await this.userRepository.findOneBy({ id: id });

      if (!editedUser) {
        throw new NotFoundException('User not found');
      }

      editedUser.firstName = updateAuthDto.firstName;
      editedUser.age = updateAuthDto.age;
      editedUser.email = updateAuthDto.email;

      await this.userRepository.save(editedUser);

      return editedUser;
    } catch (error) {
      console.log(error);
    }
  }

  async removeAuth(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ id: id });
  }
}
