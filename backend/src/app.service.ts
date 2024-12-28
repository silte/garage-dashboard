import { Injectable } from '@nestjs/common';

import { HassioCacheService } from './hassio-cache.service';
import { HassioConnectorService } from './hassio-connector.service';
import { SocketGateway } from './socket.gateway';

@Injectable()
export class AppService {
  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly hassioConnectorService: HassioConnectorService,
    private readonly hassioCacheService: HassioCacheService,
  ) {
    this.hassioConnectorService.subscribeMessageListener((data) =>
      this.socketGateway.broadcastUpdate(data),
    );
  }

  getIsReady() {
    return this.hassioConnectorService.getIsReady();
  }

  async getIsHealthy() {
    try {
      return await this.hassioConnectorService.healthCheck();
    } catch {
      return false;
    }
  }

  getCacheData() {
    return this.hassioCacheService.getCacheData();
  }
}
