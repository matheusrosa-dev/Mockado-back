import { Controller, Get, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthenticationErrorFilter } from "../authentication-error.filter";
import request from "supertest";
import { AuthenticationError } from "../../../../core/domain/shared/errors/authentication.error";

const errorMessage = "Invalid credentials";

@Controller("stub")
class StubController {
  @Get()
  index() {
    throw new AuthenticationError(errorMessage);
  }
}

describe("Authentication Error Filter - Unit Tests", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new AuthenticationErrorFilter());
    await app.init();
  });

  it("should catch an Authentication Error", () => {
    return request(app.getHttpServer()).get("/stub").expect(401).expect({
      statusCode: 401,
      error: "Unauthorized",
      message: errorMessage,
    });
  });
});
