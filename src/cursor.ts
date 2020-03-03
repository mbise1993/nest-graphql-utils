export class Cursor {
  public static encode(offset: number) {
    return Buffer.from(offset.toString()).toString('base64');
  }

  public static decode(cursor: string) {
    return parseInt(Buffer.from(cursor, 'base64').toString('ascii'));
  }
}
