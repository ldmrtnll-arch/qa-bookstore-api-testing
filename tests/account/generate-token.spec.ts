import { expect, test } from '@playwright/test';
import {
  generateUniqueUsername,
  validUserPassword,
} from '../../test-data/users-data';
import type { GenerateTokenResponse } from '../../types/authentication';
import type { CreatedUserResponse } from '../../types/user';
import { cleanupTestUser } from '../../utils/account-api';

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

      expect(tokenResponse.headers()['content-type']).toContain(
        'application/json',
      );

      const responseBody =
        (await tokenResponse.json()) as GenerateTokenResponse;

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
});