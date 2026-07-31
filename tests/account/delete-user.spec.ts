import { expect, test } from '@playwright/test';
import {
  generateUniqueUsername,
  userNotFoundError,
  validUserPassword,
} from '../../test-data/users-data';
import type { ApiErrorResponse } from '../../types/api-error';
import type { GenerateTokenResponse } from '../../types/authentication';
import type { CreatedUserResponse } from '../../types/user';

test.describe('DELETE /Account/v1/User/{UUID}', () => {
  test('API-ACC-006 - should delete an authenticated user successfully', async ({
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
    expect(createdUser.username).toBe(username);

    const tokenResponse = await request.post(
      '/Account/v1/GenerateToken',
      {
        data: userData,
      },
    );

    expect(tokenResponse.status()).toBe(200);

    const generatedToken =
      (await tokenResponse.json()) as GenerateTokenResponse;

    expect(generatedToken.token).toBeTruthy();

    const deleteUserResponse = await request.delete(
      `/Account/v1/User/${createdUser.userID}`,
      {
        headers: {
          Authorization: `Bearer ${generatedToken.token}`,
        },
      },
    );

    expect(deleteUserResponse.status()).toBe(204);

    const deleteResponseBody = await deleteUserResponse.text();

    expect(deleteResponseBody).toBe('');

    const deletedUserResponse = await request.get(
      `/Account/v1/User/${createdUser.userID}`,
      {
        headers: {
          Authorization: `Bearer ${generatedToken.token}`,
        },
      },
    );

    expect(deletedUserResponse.status()).toBe(401);

    expect(
      deletedUserResponse.headers()['content-type'],
    ).toContain('application/json');

    const deletedUserResponseBody =
      (await deletedUserResponse.json()) as ApiErrorResponse;

    expect(deletedUserResponseBody).toEqual(userNotFoundError);
  });
});