import { Uuid } from "../../shared/value-objects/uuid.vo";
import { UserFactory } from "../user.entity";

describe("User Fake Builder - Unit Tests", () => {
  describe("one user", () => {
    it("should instance a fake user with default values", () => {
      const fakeUser = UserFactory.fake().oneUser().build();

      expect(fakeUser.userId.toString()).toBeDefined();
      expect(fakeUser.googleId).toBeDefined();
      expect(fakeUser.email).toBeDefined();
      expect(fakeUser.name).toBeDefined();
      expect(fakeUser.picture).toBeDefined();
      expect(fakeUser.isActive).toBeDefined();
      expect(fakeUser.createdAt).toBeDefined();
    });

    it("should instance a fake user with custom values", () => {
      const id = new Uuid();

      const fakeUser = UserFactory.fake()
        .oneUser()
        .withUserId(id)
        .withGoogleId("123456789012345678901")
        .withEmail("custom@email.com")
        .withName("Custom Name")
        .withPicture("https://example.com/picture.jpg")
        .withIsActive(false)
        .withCreatedAt(new Date("2024-01-01"))
        .build();

      expect(fakeUser.userId.equals(id)).toBeTruthy();
      expect(fakeUser.googleId).toBe("123456789012345678901");
      expect(fakeUser.email).toBe("custom@email.com");
      expect(fakeUser.name).toBe("Custom Name");
      expect(fakeUser.picture).toBe("https://example.com/picture.jpg");
      expect(fakeUser.isActive).toBe(false);
      expect(fakeUser.createdAt).toEqual(new Date("2024-01-01"));
    });

    it("should instance a fake user with factory functions as values", () => {
      const fakeUser = UserFactory.fake()
        .oneUser()
        .withUserId(() => new Uuid())
        .withGoogleId(() => "987654321098765432109")
        .withEmail(() => "factory@email.com")
        .withName(() => "Factory Name")
        .withPicture(() => "https://example.com/factory.jpg")
        .withIsActive(() => true)
        .withCreatedAt(() => new Date("2025-06-15"))
        .build();

      expect(fakeUser.userId.toString()).toBeDefined();
      expect(fakeUser.googleId).toBe("987654321098765432109");
      expect(fakeUser.email).toBe("factory@email.com");
      expect(fakeUser.name).toBe("Factory Name");
      expect(fakeUser.picture).toBe("https://example.com/factory.jpg");
      expect(fakeUser.isActive).toBe(true);
      expect(fakeUser.createdAt).toEqual(new Date("2025-06-15"));
    });
  });

  describe("many users", () => {
    it("should instance an array of fake users with default values", () => {
      const amount = 5;
      const fakeUsers = UserFactory.fake().manyUsers(amount).build();

      expect(fakeUsers).toHaveLength(amount);
      fakeUsers.forEach((user) => {
        expect(user.userId.toString()).toBeDefined();
        expect(user.googleId).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.name).toBeDefined();
        expect(user.picture).toBeDefined();
        expect(user.isActive).toBeDefined();
        expect(user.createdAt).toBeDefined();
      });
    });

    it("should instance an array of fake users with custom values", () => {
      const id = new Uuid();
      const amount = 3;

      const fakeUsers = UserFactory.fake()
        .manyUsers(amount)
        .withUserId(id)
        .withGoogleId("123456789012345678901")
        .withEmail("custom@email.com")
        .withName("Custom Name")
        .withPicture("https://example.com/picture.jpg")
        .withIsActive(false)
        .withCreatedAt(new Date("2024-01-01"))
        .build();

      expect(fakeUsers).toHaveLength(amount);
      fakeUsers.forEach((user) => {
        expect(user.userId.equals(id)).toBeTruthy();
        expect(user.googleId).toBe("123456789012345678901");
        expect(user.email).toBe("custom@email.com");
        expect(user.name).toBe("Custom Name");
        expect(user.picture).toBe("https://example.com/picture.jpg");
        expect(user.isActive).toBe(false);
        expect(user.createdAt).toEqual(new Date("2024-01-01"));
      });
    });

    it("should instance an array of fake users with factory functions as values", () => {
      const amount = 3;

      const fakeUsers = UserFactory.fake()
        .manyUsers(amount)
        .withGoogleId(() => "987654321098765432109")
        .withEmail(() => "factory@email.com")
        .withName(() => "Factory Name")
        .withIsActive(() => true)
        .withCreatedAt(() => new Date("2025-06-15"))
        .build();

      expect(fakeUsers).toHaveLength(amount);
      fakeUsers.forEach((user) => {
        expect(user.googleId).toBe("987654321098765432109");
        expect(user.email).toBe("factory@email.com");
        expect(user.name).toBe("Factory Name");
        expect(user.isActive).toBe(true);
        expect(user.createdAt).toEqual(new Date("2025-06-15"));
      });
    });
  });
});
