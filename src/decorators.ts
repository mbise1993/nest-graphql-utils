import { createParamDecorator } from '@nestjs/common';
import { Response } from 'express';

import { User } from 'src/identity/models/user';

export const GqlResponse = createParamDecorator(
  (_data, [_root, _args, ctx, _info]): Response => ctx.res,
);

export const GqlUser = createParamDecorator(
  (_data, [_root, _args, ctx, _info]): User => ctx.req && ctx.req.user,
);
