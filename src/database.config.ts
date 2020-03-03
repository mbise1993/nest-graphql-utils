import { ConnectionOptions } from 'typeorm';

import { rootPath } from './directory';

export const createConnectionOptions = (): ConnectionOptions => {
  return {
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    entities: [rootPath + '/**/*.entity{.ts,.js}'],
    migrations: [rootPath + '/database/migrations/*{.ts,.js}'],
    synchronize: true,
  };
};
