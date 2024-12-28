export class HassioCacheService {
  private cacheIsGarageClosed: boolean = null;

  private cacheGarageTemperature: number = null;

  private cacheOutsideTemperature: number = null;

  setIsGarageClosed(isGarageOpen: string | null) {
    this.cacheIsGarageClosed =
      typeof isGarageOpen === 'string' ? isGarageOpen === 'off' : null;
  }

  getIsGarageClosed() {
    return this.cacheIsGarageClosed;
  }

  setGarageTemperature(garageTemperature: number | string) {
    this.cacheGarageTemperature = parseFloat(garageTemperature?.toString());
  }

  getGarageTemperature() {
    return this.cacheGarageTemperature;
  }

  setOutsideTemperature(outsideTemperature: number | string) {
    this.cacheOutsideTemperature = parseFloat(outsideTemperature?.toString());
  }

  getOutsideTemperature() {
    return this.cacheOutsideTemperature;
  }

  getCacheData() {
    return {
      isGarageDoorClosed: this.cacheIsGarageClosed,
      garageTemperature: this.cacheGarageTemperature,
      outsideTemperature: this.cacheOutsideTemperature,
    };
  }
}
