import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { PostgresModule } from '../database/database.module';
import { User } from '../database/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@webeleon/nestjs-redis';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => RedisModule.forFeature()),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
