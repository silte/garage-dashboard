import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configuration } from './config/configuration';
import { HassioCacheService } from './hassio-cache.service';
import { HassioConnectorService } from './hassio-connector.service';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      load: [configuration],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      serveRoot: process.env.BASE_PATH || '',
      exclude: [
        `${process.env.BASE_PATH || ''}/socket.io`,
        `${process.env.BASE_PATH || ''}/healthz`,
        `${process.env.BASE_PATH || ''}/readyz`,
        `${process.env.BASE_PATH || ''}/cache`,
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    HassioConnectorService,
    AppService,
    SocketGateway,
    HassioCacheService,
  ],
})
export class AppModule {}
