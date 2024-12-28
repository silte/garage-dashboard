import { Injectable, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  path: `${process.env.BASE_PATH || ''}/socket.io`,
})
@Injectable()
export class SocketGateway implements OnGatewayConnection {
  private readonly logger = new Logger(SocketGateway.name);

  private cacheData: unknown = {
    isGarageDoorClosed: null,
    garageTemperature: null,
    outsideTemperature: null,
  };

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.debug('websocket client connected');
    client.emit('update', this.cacheData);
  }

  broadcastUpdate(payload: unknown) {
    this.cacheData = payload;
    this.server.emit('update', payload);
  }
}
