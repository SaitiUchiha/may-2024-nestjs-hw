// import * as process from 'process';
// import { ConfigurationType } from './configuration.type';
//
// export default (): ConfigurationType => ({
//   app: {
//     port:parseInt(process.env.PORT || '3000', 10),
//     host: process.env.HOST || '0.0.0.0',
//   },
//   database: {
//     host: process.env.DATABASE_HOST || '0.0.0.0',
//     port: parseInt(process.env.DATABASE_PORT || '5050', 10),
//     password: process.env.DB_PASSWORD,
//     user: process.env.DB_USERNAME,
//     database: process.env.DB_NAME,
//   },
// });
import * as process from 'process';

export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
  },
});
