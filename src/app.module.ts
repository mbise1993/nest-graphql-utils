import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';

import { IdentityModule } from './identity/identity.module';
import { rootPath } from './directory';
import { BandModule } from './band/band.module';
import { ChatModule } from './chat/chat.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    IdentityModule,
    BandModule,
    ChatModule,
    CommonModule,
    TypeOrmModule.forRoot({
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
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
      context: ({ req, res }) => ({ req, res }),
    }),
  ],
})
export class AppModule {}
