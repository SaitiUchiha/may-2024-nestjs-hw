import * as process from 'process';

export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    password: process.env.POSTGRES_PASSWORD,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
  },
});
