// import { Injectable } from '@nestjs/common';
// import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
// import { ConfigService } from '@nestjs/config';
// import { User } from './entities/user.entity';
// import {
//   ConfigurationType,
//   PostgresConfig,
// } from '../common/configs/configuration.type';
//
// @Injectable()
// export class PostgresService implements TypeOrmOptionsFactory {
//   constructor(
//     private readonly configService: ConfigService<ConfigurationType>,
//   ) {}
//   createTypeOrmOptions(): TypeOrmModuleOptions {
//     const postgresConfig = this.configService.get<PostgresConfig>('database');
//     return {
//       type: 'postgres',
//       host: postgresConfig?.host,
//       port: postgresConfig?.port,
//       username: postgresConfig?.user,
//       password: postgresConfig?.password,
//       database: postgresConfig?.dbName,
//       entities: [User],
//       // migrations
//       synchronize: true,
//     };
//   }
// }


import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';


@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const postgresConfig = this.configService.get('database');
    return {
      type: 'postgres',
      host: postgresConfig.host,
      port: postgresConfig.port,
      username: postgresConfig.user,
      password: postgresConfig.password,
      database: postgresConfig.database,
      entities: [User],
      // migrations
      synchronize: false,
    };
  }
}