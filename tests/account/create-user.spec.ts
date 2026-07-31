import { expect, test } from '@playwright/test';
import {
  generateUniqueUsername,
  validUserPassword,
} from '../../test-data/users-data';
import type { CreatedUserResponse } from '../../types/user';

test.describe('POST /Account/v1/User', () => {
  test('API-ACC-001 - should create a user with valid credentials', async ({
    request,
  }) => {
    const username = generateUniqueUsername();

    const response = await request.post('/Account/v1/User', {
      data: {
        userName: username,
        password: validUserPassword,
      },
    });

    expect(response.status()).toBe(201);

    expect(response.headers()['content-type']).toContain(
      'application/json',
    );

    const responseBody =
      (await response.json()) as CreatedUserResponse;

    expect(responseBody.userID).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );

    expect(responseBody.username).toBe(username);

    expect(Array.isArray(responseBody.books)).toBe(true);
    expect(responseBody.books).toHaveLength(0);
  });
});