// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { PostgresService } from './database.service';
// import { ConfigModule, ConfigService } from '@nestjs/config';
//
// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({
//       useClass: PostgresService,
//       imports: [ConfigModule],
//       inject: [ConfigService],
//     }),
//   ],
// })
// export class PostgresModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
