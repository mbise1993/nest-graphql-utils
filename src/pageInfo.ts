import { ObjectType, Field } from 'type-graphql';

@ObjectType({ description: 'Provides info abou the current page' })
export class PageInfo {
  constructor(
    startCursor: string,
    endCursor: string,
    hasPreviousPage: boolean,
    hasNextPage: boolean,
  ) {
    this.startCursor = startCursor;
    this.endCursor = endCursor;
    this.hasPreviousPage = hasPreviousPage;
    this.hasNextPage = hasNextPage;
  }

  @Field({ description: 'Cursor referencing the beginning of the page' })
  startCursor: string;

  @Field({ description: 'Cursor referencing the end of the page' })
  endCursor: string;

  @Field()
  hasPreviousPage: boolean;

  @Field()
  hasNextPage: boolean;
}
