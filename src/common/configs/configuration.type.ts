export type ConfigurationType = {
  port: number;
  database: PostgresConfig;
};

export type PostgresConfig = {
  port: number;
  host: string;
  user: string;
  password: string;
  dbName: string;
};
