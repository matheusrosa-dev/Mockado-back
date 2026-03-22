import { AuthenticationError } from "../../../core/domain/shared/errors/authentication.error";
import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";

@Catch(AuthenticationError)
export class AuthenticationErrorFilter implements ExceptionFilter {
  catch(exception: AuthenticationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    response.status(401).json({
      statusCode: 401,
      error: "Unauthorized",
      message: exception.message,
    });
  }
}
