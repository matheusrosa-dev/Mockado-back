import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export interface ICurrentSession {
  userId: string;
  name: string;
  email: string;
  refreshToken: string;
}

export const CurrentSession = createParamDecorator(
  (_data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const session = request.user as ICurrentSession;

    return session;
  },
);
