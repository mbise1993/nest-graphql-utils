import { ClassType, ObjectType, Field } from 'type-graphql';

export interface IEdge<TNode> {
  cursor: string;
  node: TNode;
}

export const Edge = <TNode>(TNodeClass: ClassType<TNode>) => {
  @ObjectType({ isAbstract: true })
  abstract class EdgeClass implements IEdge<TNode> {
    @Field()
    public cursor: string;

    @Field(type => TNodeClass)
    public node: TNode;
  }

  return EdgeClass;
};
