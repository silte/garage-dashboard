import { BadGatewayException, Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('readyz')
  getReadyState() {
    const isReady = this.appService.getIsReady();

    if (!isReady) {
      throw new BadGatewayException('not ok');
    }

    return 'ok';
  }

  @Get('healthz')
  async getHealthState() {
    const isHealth = await this.appService.getIsHealthy();

    if (!isHealth) {
      throw new BadGatewayException('not ok');
    }

    return 'ok';
  }

  @Get('cache')
  getCacheData() {
    return this.appService.getCacheData();
  }
}
