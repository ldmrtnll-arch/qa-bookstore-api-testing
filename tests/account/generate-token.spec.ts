import { expect, test } from '@playwright/test';
import {
  failedAuthorizationResponse,
  incorrectUserPassword,
} from '../../test-data/authentication-data';
import {
  generateUniqueUsername,
  usernameAndPasswordRequiredError,
  validUserPassword,
} from '../../test-data/users-data';
import type {
  FailedGenerateTokenResponse,
  SuccessfulGenerateTokenResponse,
} from '../../types/authentication';
import type { CreatedUserResponse } from '../../types/user';
import {
  cleanupTestUser,
  createTestUser,
  generateTokenForUser,
} from '../../utils/account-api';
import type { ApiErrorResponse } from '../../types/api-error';

test.describe('POST /Account/v1/GenerateToken', () => {
  test('API-AUTH-001 - should generate a token with valid credentials', async ({
    request,
  }) => {
    const username = generateUniqueUsername();

    const userData = {
      userName: username,
      password: validUserPassword,
    };

    const createUserResponse = await request.post(
      '/Account/v1/User',
      {
        data: userData,
      },
    );

    expect(createUserResponse.status()).toBe(201);

    const createdUser =
      (await createUserResponse.json()) as CreatedUserResponse;

    expect(createdUser.userID).toBeTruthy();

    let generatedToken: string | undefined;

    try {
      const tokenResponse = await request.post(
        '/Account/v1/GenerateToken',
        {
          data: userData,
        },
      );

      expect(tokenResponse.status()).toBe(200);

      expect(
        tokenResponse.headers()['content-type'],
      ).toContain('application/json');

      const responseBody =
        (await tokenResponse.json()) as SuccessfulGenerateTokenResponse;

      generatedToken = responseBody.token;

      expect(responseBody.token).toBeTruthy();
      expect(responseBody.token.split('.')).toHaveLength(3);

      expect(
        Number.isNaN(Date.parse(responseBody.expires)),
        'expires should contain a valid date',
      ).toBe(false);

      expect(
        new Date(responseBody.expires).getTime(),
        'token expiration should be in the future',
      ).toBeGreaterThan(Date.now());

      expect(responseBody.status).toBe('Success');

      expect(responseBody.result).toBe(
        'User authorized successfully.',
      );
    } finally {
      if (generatedToken) {
        await cleanupTestUser(
          request,
          createdUser.userID,
          generatedToken,
        );
      }
    }
  });

  test('API-AUTH-002 - should fail token generation when the password is incorrect', async ({
    request,
  }) => {
    const testUser = await createTestUser(request);

    try {
      const response = await request.post(
        '/Account/v1/GenerateToken',
        {
          data: {
            userName: testUser.credentials.userName,
            password: incorrectUserPassword,
          },
        },
      );

      expect(response.status()).toBe(200);

      expect(response.headers()['content-type']).toContain(
        'application/json',
      );

      const responseBody =
        (await response.json()) as FailedGenerateTokenResponse;

      expect(responseBody).toEqual(
        failedAuthorizationResponse,
      );

      expect(responseBody.token).toBeNull();
      expect(responseBody.expires).toBeNull();
      expect(responseBody.status).toBe('Failed');
    } finally {
      const generatedToken = await generateTokenForUser(
        request,
        testUser.credentials,
      );

      await cleanupTestUser(
        request,
        testUser.userID,
        generatedToken.token,
      );
    }
  });

      test('API-AUTH-003 - should fail token generation for a nonexistent user', async ({
    request,
  }) => {
    const nonexistentUsername = generateUniqueUsername();

    const response = await request.post(
      '/Account/v1/GenerateToken',
      {
        data: {
          userName: nonexistentUsername,
          password: validUserPassword,
        },
      },
    );

    expect(response.status()).toBe(200);

    expect(response.headers()['content-type']).toContain(
      'application/json',
    );

    const responseBody =
      (await response.json()) as FailedGenerateTokenResponse;

    expect(responseBody).toEqual(
      failedAuthorizationResponse,
    );

    expect(responseBody.token).toBeNull();
    expect(responseBody.expires).toBeNull();
    expect(responseBody.status).toBe('Failed');
    expect(responseBody.result).toBe(
      'User authorization failed.',
    );
  });

      test('API-AUTH-004 - should return an error when generating a token with an empty username', async ({
    request,
  }) => {
    const response = await request.post(
      '/Account/v1/GenerateToken',
      {
        data: {
          userName: '',
          password: validUserPassword,
        },
      },
    );

    expect(response.status()).toBe(400);

    expect(response.headers()['content-type']).toContain(
      'application/json',
    );

    const responseBody =
      (await response.json()) as ApiErrorResponse;

    expect(responseBody).toEqual(
      usernameAndPasswordRequiredError,
    );
  });

      test('API-AUTH-005 - should return an error when generating a token with an empty password', async ({
    request,
  }) => {
    const username = generateUniqueUsername();

    const response = await request.post(
      '/Account/v1/GenerateToken',
      {
        data: {
          userName: username,
          password: '',
        },
      },
    );

    expect(response.status()).toBe(400);

    expect(response.headers()['content-type']).toContain(
      'application/json',
    );

    const responseBody =
      (await response.json()) as ApiErrorResponse;

    expect(responseBody).toEqual(
      usernameAndPasswordRequiredError,
    );
  });
});