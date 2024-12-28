import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as WebSocket from 'ws';

import { HassioCacheService } from './hassio-cache.service';

@Injectable()
export class HassioConnectorService {
  private readonly logger = new Logger(HassioConnectorService.name);

  private readonly ws: WebSocket;

  private pushUpdate: () => void;

  private isMessageListenerActive = false;

  private healthCheckPromise: Promise<boolean>;

  private resolveHealthCheckPromise: () => void;

  private previousId = 0;

  constructor(
    private readonly configService: ConfigService,
    private readonly hassioCacheService: HassioCacheService,
  ) {
    this.ws = new WebSocket(
      `${this.configService.get('hassioUrl')}/api/websocket`,
    );

    this.ws.on('open', () => {
      this.logger.log('Connected to Home Assistant');
    });
  }

  subscribeMessageListener(pushUpdate: (data: any) => void) {
    if (this.isMessageListenerActive) return;

    this.isMessageListenerActive = true;
    this.pushUpdate = () => pushUpdate(this.hassioCacheService.getCacheData());

    this.ws.on('message', (event) => this.messageHandler(event));
  }

  getIsReady() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  async healthCheck() {
    if (this.healthCheckPromise) {
      return this.healthCheckPromise;
    }

    this.healthCheckPromise = new Promise((resolve, reject) => {
      this.sendPing();
      this.resolveHealthCheckPromise = () => resolve(true);

      setTimeout(() => reject(new Error('Hassio connection timeout')), 5000);
    });

    this.healthCheckPromise.finally(() => {
      this.healthCheckPromise = null;
      this.resolveHealthCheckPromise = null;
    });

    return this.healthCheckPromise;
  }

  private messageHandler(message: WebSocket.RawData) {
    const data = JSON.parse(message.toString()) as { type: string } & unknown;
    // this.logger.verbose(message.toString());

    switch (data.type) {
      case 'auth_required':
        this.authenticateConnection();
        break;
      case 'auth_ok':
        this.subscribeEventsUpdates();
        this.preFetchStates();
        break;
      case 'event':
        this.handleEventUpdate(data);
        break;
      case 'result':
        this.handlePreFetchedStates(data);
        break;
      case 'pong':
        this.resolveHealthCheckPromise?.();
        break;
      default:
        break;
    }
  }

  private authenticateConnection() {
    this.ws.send(
      JSON.stringify({
        type: 'auth',
        access_token: this.configService.get('hassioAuthToken'),
      }),
    );
  }

  private subscribeEventsUpdates() {
    this.ws.send(
      JSON.stringify({
        id: this.getRequestId(),
        type: 'subscribe_events',
        event_type: 'state_changed',
      }),
    );
  }

  private preFetchStates() {
    this.ws.send(
      JSON.stringify({
        id: this.getRequestId(),
        type: 'get_states',
      }),
    );
  }

  private handleEventUpdate(response: any) {
    const entityId = response?.event?.data?.entity_id;
    const newEntityState = response?.event?.data?.new_state?.state;

    switch (entityId) {
      case this.configService.get('garageDoor'):
        this.hassioCacheService.setIsGarageClosed(newEntityState);
        this.pushUpdate();
        break;
      case this.configService.get('garageTemperature'):
        this.hassioCacheService.setGarageTemperature(newEntityState);
        this.pushUpdate();
        break;
      case this.configService.get('outsideTemperature'):
        this.hassioCacheService.setOutsideTemperature(newEntityState);
        this.pushUpdate();
        break;
      default:
        break;
    }
  }

  private handlePreFetchedStates(response: any) {
    response.result?.forEach(({ entity_id, state }) => {
      switch (entity_id) {
        case this.configService.get('garageDoor'):
          this.hassioCacheService.setIsGarageClosed(state);
          this.pushUpdate();
          break;
        case this.configService.get('garageTemperature'):
          this.hassioCacheService.setGarageTemperature(state);
          this.pushUpdate();
          break;
        case this.configService.get('outsideTemperature'):
          this.hassioCacheService.setOutsideTemperature(state);
          this.pushUpdate();
          break;
        default:
          break;
      }
    });
  }

  private sendPing() {
    this.logger.debug('Send hassio ping');
    this.ws.send(
      JSON.stringify({
        id: this.getRequestId(),
        type: 'ping',
      }),
    );
  }

  private getRequestId() {
    this.previousId = this.previousId + 1;

    return this.previousId;
  }
}
