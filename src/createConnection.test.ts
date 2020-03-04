import { createConnection } from './createConnection';
import { PaginationArgs } from './connection';
import { TestConnection } from './testUtils';
import { Cursor } from './cursor';

describe(createConnection.name, () => {
  describe('no pagination args', () => {
    it('skips 0 and takes default page size', async () => {
      const paginationArgs = new PaginationArgs();

      await createConnection({
        paginationArgs,
        connectionClass: TestConnection,
        defaultPageSize: 10,
        paginate: args => {
          expect(args.skip).toEqual(0);
          expect(args.take).toEqual(10);
          return Promise.resolve([[], 0]);
        },
      });
    });
  });

  describe('forward pagination', () => {
    it('skips "after" offset and takes "first"', async () => {
      const paginationArgs = new PaginationArgs();
      paginationArgs.after = Cursor.create(TestConnection.name, 10);
      paginationArgs.first = 10;

      await createConnection({
        paginationArgs,
        connectionClass: TestConnection,
        paginate: args => {
          expect(args.skip).toEqual(10);
          expect(args.take).toEqual(10);
          return Promise.resolve([[], 0]);
        },
      });
    });
  });

  describe('backward pagination', () => {
    it('skips "before" - "last" and takes "last"', async () => {
      const paginationArgs = new PaginationArgs();
      paginationArgs.before = Cursor.create(TestConnection.name, 30);
      paginationArgs.last = 10;

      await createConnection({
        paginationArgs,
        connectionClass: TestConnection,
        paginate: args => {
          expect(args.skip).toEqual(20);
          expect(args.take).toEqual(10);
          return Promise.resolve([[], 0]);
        },
      });
    });
  });
});
