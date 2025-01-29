import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';

import { UpdateAuthDto } from './dto/auth.dto';
import { UserDto } from '../user/dto/user.dto';
import { User } from '../database/entities/user.entity';

@Injectable()
export class AuthService {
  private redisUserKey = 'user-token';
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRedisClient() private readonly redisClient: RedisClient,
    private readonly jwtService: JwtService
  ) {}

  async signUpUser(body: UserDto): Promise<{ accessToken: string }> {
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
    await this.redisClient.setEx(`${this.redisUserKey}-${user.id}`, 24 * 60 * 60, token);

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
      }
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async singIn(userId:string, userEmail:string): Promise<string> {
    return this.jwtService.sign({id: userId, email: userEmail});
  }

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
