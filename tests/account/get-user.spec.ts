import { expect, test } from '@playwright/test';
import { userDetailsResponseSchema } from '../../schemas/user-details-response.schema';
import type { UserDetailsResponse } from '../../types/user-details';
import {
  cleanupTestUser,
  createAuthenticatedTestUser,
} from '../../utils/account-api';
import { assertMatchesSchema } from '../../utils/schema-validator';

test.describe('GET /Account/v1/User/{UUID}', () => {
  test('API-ACC-007 - should return the authenticated user details', async ({
    request,
  }) => {
    const testUser =
      await createAuthenticatedTestUser(request);

    try {
      const response = await request.get(
        `/Account/v1/User/${testUser.userID}`,
        {
          headers: {
            Authorization: `Bearer ${testUser.token}`,
          },
        },
      );

      expect(response.status()).toBe(200);

      expect(
        response.headers()['content-type'],
      ).toContain('application/json');

      const responseBody: unknown =
        await response.json();

      assertMatchesSchema<UserDetailsResponse>(
        userDetailsResponseSchema,
        responseBody,
        'GET /Account/v1/User/{UUID} success response',
      );

      expect(responseBody.userId).toBe(
        testUser.userID,
      );

      expect(responseBody.username).toBe(
        testUser.credentials.userName,
      );

      expect(
        responseBody.books,
        'A newly created user should have an empty book collection',
      ).toHaveLength(0);
    } finally {
      await cleanupTestUser(
        request,
        testUser.userID,
        testUser.token,
      );
    }
  });
});