import DataLoader = require('dataloader');

export abstract class BatchLoader<T> {
  private loader: DataLoader<number, T>;

  constructor(load: (ids: number[]) => Promise<T[]>) {
    this.loader = new DataLoader<number, T>(keys => load(keys as number[]));
  }

  public async load(id: number) {
    return await this.loader.load(id);
  }
}
