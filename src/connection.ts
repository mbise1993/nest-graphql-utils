import { ClassType, ObjectType, Field, Int, ArgsType } from 'type-graphql';

import { PageInfo } from './pageInfo';
import { Edge, IEdge } from './edge';
import { Min } from 'class-validator';
import { Cursor } from './cursor';

export interface IConnection<TNode> {
  totalCount: number;
  pageInfo: PageInfo;
  edges: IEdge<TNode>[];
}

export const Connection = <TNode>(TNodeClass: ClassType<TNode>) => {
  @ObjectType(`${TNodeClass.name}Edge`)
  class EdgeClass extends Edge(TNodeClass) {}

  @ObjectType({
    isAbstract: true,
    description: `Provides paginated ${TNodeClass.name} data`,
  })
  abstract class ConnectionClass implements IConnection<TNode> {
    constructor(totalCount: number, pageInfo: PageInfo, edges: EdgeClass[]) {
      this.totalCount = totalCount;
      this.pageInfo = pageInfo;
      this.edges = edges;
    }

    @Field(type => Int, {
      description: `Total number of ${TNodeClass.name} objects`,
    })
    public totalCount: number;

    @Field(type => PageInfo)
    public pageInfo: PageInfo;

    @Field(type => EdgeClass, {
      description: `Array of ${TNodeClass.name} objects`,
    })
    public edges: EdgeClass[];
  }

  return ConnectionClass;
};

@ArgsType()
export class ConnectionArgs {
  @Field(type => Int, { nullable: true })
  @Min(0)
  public first?: number;

  @Field({ nullable: true })
  public after?: string;
}

interface IConnectionClass<TNode> {
  new (
    totalCount: number,
    pageInfo: PageInfo,
    edges: IEdge<TNode>[],
  ): IConnection<TNode>;
}

export interface IPaginateArgs {
  skip: number;
  take: number;
}

export interface ICreateConnectionOptions<TEntity, TNode> {
  paginate(args: IPaginateArgs): Promise<[TEntity[], number]>;
  mapToNode(entity: TEntity): TNode;
  connectionClass: IConnectionClass<TNode>;
  connectionArgs: ConnectionArgs;
}

export const createConnection = async <TEntity, TNode>(
  options: ICreateConnectionOptions<TEntity, TNode>,
) => {
  const { first, after } = options.connectionArgs;

  const take = first || 20;
  const skip = after ? Cursor.decode(after) : 0;
  const [entities, totalCount] = await options.paginate({ skip, take });

  const pageInfo = new PageInfo(
    Cursor.encode(skip),
    Cursor.encode(skip + entities.length),
    skip > 0,
    skip + entities.length >= skip + take,
  );

  const edges = entities.map((entity, index) => {
    return {
      cursor: Cursor.encode(skip + index),
      node: options.mapToNode(entity),
    };
  });

  return new options.connectionClass(totalCount, pageInfo, edges);
};
