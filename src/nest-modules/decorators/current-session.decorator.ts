import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export interface ICurrentSession {
  name: string;
  email: string;
  googleId: string;
  iat: number;
  exp: number;
  refreshToken: string;
}

export const CurrentSession = createParamDecorator(
  (_data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const session = request.user as ICurrentSession;

    return session;
  },
);
