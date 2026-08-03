import { expect, test } from '@playwright/test';
import { apiErrorSchema } from '../../schemas/api-error.schema';
import { authorizedResponseSchema } from '../../schemas/authorized-response.schema';
import {
  authorizationUserNotFoundError,
  incorrectUserPassword,
} from '../../test-data/authentication-data';
import {
  generateUniqueUsername,
  usernameAndPasswordRequiredError,
  validUserPassword,
} from '../../test-data/users-data';
import type { ApiErrorResponse } from '../../types/api-error';
import {
  cleanupTestUser,
  createAuthenticatedTestUser,
  createTestUser,
  generateTokenForUser,
} from '../../utils/account-api';
import { assertMatchesSchema } from '../../utils/schema-validator';

test.describe('POST /Account/v1/Authorized', () => {
  test('API-AUTH-006 - should authorize the user only after token generation', async ({
    request,
  }) => {
    const testUser = await createTestUser(request);
    let generatedToken: string | undefined;

    try {
      const responseBeforeToken = await request.post(
        '/Account/v1/Authorized',
        {
          data: testUser.credentials,
        },
      );

      expect(responseBeforeToken.status()).toBe(200);

      expect(
        responseBeforeToken.headers()['content-type'],
      ).toContain('application/json');

      const authorizationBeforeToken: unknown =
        await responseBeforeToken.json();

      assertMatchesSchema<boolean>(
        authorizedResponseSchema,
        authorizationBeforeToken,
        'POST /Account/v1/Authorized response before token generation',
      );

      expect(authorizationBeforeToken).toBe(false);

      const tokenResponse = await generateTokenForUser(
        request,
        testUser.credentials,
      );

      generatedToken = tokenResponse.token;

      const responseAfterToken = await request.post(
        '/Account/v1/Authorized',
        {
          data: testUser.credentials,
        },
      );

      expect(responseAfterToken.status()).toBe(200);

      expect(
        responseAfterToken.headers()['content-type'],
      ).toContain('application/json');

      const authorizationAfterToken: unknown =
        await responseAfterToken.json();

      assertMatchesSchema<boolean>(
        authorizedResponseSchema,
        authorizationAfterToken,
        'POST /Account/v1/Authorized response after token generation',
      );

      expect(authorizationAfterToken).toBe(true);
    } finally {
      if (!generatedToken) {
        const cleanupToken = await generateTokenForUser(
          request,
          testUser.credentials,
        );

        generatedToken = cleanupToken.token;
      }

      await cleanupTestUser(
        request,
        testUser.userID,
        generatedToken,
      );
    }
  });

  test('API-AUTH-007 - should return an error when authorizing with an incorrect password', async ({
    request,
  }) => {
    const testUser =
      await createAuthenticatedTestUser(request);

    try {
      const response = await request.post(
        '/Account/v1/Authorized',
        {
          data: {
            userName: testUser.credentials.userName,
            password: incorrectUserPassword,
          },
        },
      );

      expect(response.status()).toBe(404);

      expect(
        response.headers()['content-type'],
      ).toContain('application/json');

      const responseBody: unknown =
        await response.json();

      assertMatchesSchema<ApiErrorResponse>(
        apiErrorSchema,
        responseBody,
        'POST /Account/v1/Authorized incorrect password error',
      );

      expect(responseBody).toEqual(
        authorizationUserNotFoundError,
      );

      expect(responseBody.code).toBe('1207');

      expect(responseBody.message).toBe(
        'User not found!',
      );
    } finally {
      await cleanupTestUser(
        request,
        testUser.userID,
        testUser.token,
      );
    }
  });

  test('API-AUTH-008 - should return an error when authorizing a nonexistent user', async ({
    request,
  }) => {
    const response = await request.post(
      '/Account/v1/Authorized',
      {
        data: {
          userName: generateUniqueUsername(),
          password: validUserPassword,
        },
      },
    );

    expect(response.status()).toBe(404);

    expect(
      response.headers()['content-type'],
    ).toContain('application/json');

    const responseBody: unknown =
      await response.json();

    assertMatchesSchema<ApiErrorResponse>(
      apiErrorSchema,
      responseBody,
      'POST /Account/v1/Authorized nonexistent user error',
    );

    expect(responseBody).toEqual(
      authorizationUserNotFoundError,
    );

    expect(responseBody.code).toBe('1207');

    expect(responseBody.message).toBe(
      'User not found!',
    );
  });

  test('API-AUTH-009 - should return an error when authorizing with an empty username', async ({
    request,
  }) => {
    const response = await request.post(
      '/Account/v1/Authorized',
      {
        data: {
          userName: '',
          password: validUserPassword,
        },
      },
    );

    expect(response.status()).toBe(400);

    expect(
      response.headers()['content-type'],
    ).toContain('application/json');

    const responseBody: unknown =
      await response.json();

    assertMatchesSchema<ApiErrorResponse>(
      apiErrorSchema,
      responseBody,
      'POST /Account/v1/Authorized empty username error',
    );

    expect(responseBody).toEqual(
      usernameAndPasswordRequiredError,
    );

    expect(responseBody.code).toBe('1200');

    expect(responseBody.message).toBe(
      'UserName and Password required.',
    );
  });

  test('API-AUTH-010 - should return an error when authorizing with an empty password', async ({
    request,
  }) => {
    const response = await request.post(
      '/Account/v1/Authorized',
      {
        data: {
          userName: generateUniqueUsername(),
          password: '',
        },
      },
    );

    expect(response.status()).toBe(400);

    expect(
      response.headers()['content-type'],
    ).toContain('application/json');

    const responseBody: unknown =
      await response.json();

    assertMatchesSchema<ApiErrorResponse>(
      apiErrorSchema,
      responseBody,
      'POST /Account/v1/Authorized empty password error',
    );

    expect(responseBody).toEqual(
      usernameAndPasswordRequiredError,
    );

    expect(responseBody.code).toBe('1200');

    expect(responseBody.message).toBe(
      'UserName and Password required.',
    );
  });
});