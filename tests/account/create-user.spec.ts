import { expect, test } from "@playwright/test";
import { apiErrorSchema } from "../../schemas/api-error.schema";
import { createdUserResponseSchema } from "../../schemas/created-user-response.schema";
import {
  generateUniqueUsername,
  invalidUserPassword,
  passwordRequirementsError,
  userAlreadyExistsError,
  usernameAndPasswordRequiredError,
  validUserPassword,
} from "../../test-data/users-data";
import type { ApiErrorResponse } from "../../types/api-error";
import type { CreatedUserResponse } from "../../types/user";
import { cleanupTestUser, generateTokenForUser } from "../../utils/account-api";
import { assertMatchesSchema } from "../../utils/schema-validator";

test.describe("POST /Account/v1/User", () => {
  test("API-ACC-001 - should create a user with valid credentials", async ({
    request,
  }) => {
    const username = generateUniqueUsername();

    const userData = {
      userName: username,
      password: validUserPassword,
    };

    let createdUser: CreatedUserResponse | undefined;

    try {
      const response = await request.post("/Account/v1/User", {
        data: userData,
      });

      expect(response.status()).toBe(201);

      expect(response.headers()["content-type"]).toContain("application/json");

      const responseBody: unknown = await response.json();

      assertMatchesSchema<CreatedUserResponse>(
        createdUserResponseSchema,
        responseBody,
        "POST /Account/v1/User success response",
      );

      createdUser = responseBody;

      expect(createdUser.userID).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );

      expect(createdUser.username).toBe(username);
      expect(Array.isArray(createdUser.books)).toBe(true);
      expect(createdUser.books).toHaveLength(0);
    } finally {
      if (createdUser?.userID) {
        const generatedToken = await generateTokenForUser(request, userData);

        await cleanupTestUser(
          request,
          createdUser.userID,
          generatedToken.token,
        );
      }
    }
  });

  test("API-ACC-002 - should return an error when creating a duplicated user", async ({
    request,
  }) => {
    const username = generateUniqueUsername();

    const userData = {
      userName: username,
      password: validUserPassword,
    };

    let createdUser: CreatedUserResponse | undefined;

    try {
      const firstResponse = await request.post("/Account/v1/User", {
        data: userData,
      });

      expect(firstResponse.status()).toBe(201);

      createdUser = (await firstResponse.json()) as CreatedUserResponse;

      expect(createdUser.userID).toBeTruthy();

      const duplicatedResponse = await request.post("/Account/v1/User", {
        data: userData,
      });

      expect(duplicatedResponse.status()).toBe(406);

      expect(duplicatedResponse.headers()["content-type"]).toContain(
        "application/json",
      );

      const responseBody: unknown = await duplicatedResponse.json();

      assertMatchesSchema<ApiErrorResponse>(
        apiErrorSchema,
        responseBody,
        "POST /Account/v1/User duplicated user error",
      );

      expect(responseBody).toEqual(userAlreadyExistsError);
    } finally {
      if (createdUser?.userID) {
        const generatedToken = await generateTokenForUser(request, userData);

        await cleanupTestUser(
          request,
          createdUser.userID,
          generatedToken.token,
        );
      }
    }
  });

  test("API-ACC-003 - should return an error when the password does not meet the requirements", async ({
    request,
  }) => {
    const username = generateUniqueUsername();

    const response = await request.post("/Account/v1/User", {
      data: {
        userName: username,
        password: invalidUserPassword,
      },
    });

    expect(response.status()).toBe(400);

    expect(response.headers()["content-type"]).toContain("application/json");

    const responseBody: unknown = await response.json();

    assertMatchesSchema<ApiErrorResponse>(
      apiErrorSchema,
      responseBody,
      "POST /Account/v1/User invalid password error",
    );

    expect(responseBody).toEqual(passwordRequirementsError);
  });

  test("API-ACC-004 - should return an error when the username is empty", async ({
    request,
  }) => {
    const response = await request.post("/Account/v1/User", {
      data: {
        userName: "",
        password: validUserPassword,
      },
    });

    expect(response.status()).toBe(400);

    expect(response.headers()["content-type"]).toContain("application/json");

    const responseBody: unknown = await response.json();

    assertMatchesSchema<ApiErrorResponse>(
      apiErrorSchema,
      responseBody,
      "POST /Account/v1/User empty username error",
    );

    expect(responseBody).toEqual(usernameAndPasswordRequiredError);
  });

  test("API-ACC-005 - should return an error when the password is empty", async ({
    request,
  }) => {
    const username = generateUniqueUsername();

    const response = await request.post("/Account/v1/User", {
      data: {
        userName: username,
        password: "",
      },
    });

    expect(response.status()).toBe(400);

    expect(response.headers()["content-type"]).toContain("application/json");

    const responseBody: unknown = await response.json();

    assertMatchesSchema<ApiErrorResponse>(
      apiErrorSchema,
      responseBody,
      "POST /Account/v1/User empty password error",
    );

    expect(responseBody).toEqual(usernameAndPasswordRequiredError);
  });
});
