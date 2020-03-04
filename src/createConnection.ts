import { IPageInfo } from './pageInfo';
import { Cursor } from './cursor';
import { IConnectionClass, PaginationArgs } from './connection';

export interface IPaginateArgs {
  skip: number;
  take: number;
}

export interface ICreateConnectionOptions<TNode> {
  paginationArgs: PaginationArgs;
  connectionClass: IConnectionClass<TNode>;
  defaultPageSize?: number;
  paginate(args: IPaginateArgs): Promise<[TNode[], number]>;
}

export const createConnection = async <TNode>({
  paginationArgs,
  connectionClass,
  defaultPageSize = 20,
  paginate,
}: ICreateConnectionOptions<TNode>) => {
  let skip = 0;
  let take = defaultPageSize;

  if (paginationArgs.after) {
    skip = Cursor.getOffset(paginationArgs.after);
    take = paginationArgs.first || take;
  } else if (paginationArgs.before) {
    take = paginationArgs.last || take;
    skip = Cursor.getOffset(paginationArgs.before) - take;
  }

  const [nodes, totalCount] = await paginate({ skip, take });

  const pageInfo: IPageInfo = {
    startCursor: Cursor.create(connectionClass.name, skip),
    endCursor: Cursor.create(connectionClass.name, skip + nodes.length),
    hasPreviousPage: skip > 0,
    hasNextPage: skip + nodes.length < totalCount,
  };

  const edges = nodes.map((node, index) => {
    return {
      cursor: Cursor.create(connectionClass.name, skip + index),
      node,
    };
  });

  return new connectionClass(totalCount, pageInfo, edges);
};
