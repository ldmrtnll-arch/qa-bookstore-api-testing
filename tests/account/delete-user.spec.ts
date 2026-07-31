import { expect, test } from '@playwright/test';
import { userNotFoundError } from '../../test-data/users-data';
import type { ApiErrorResponse } from '../../types/api-error';
import {
  createAuthenticatedTestUser,
  deleteTestUser,
} from '../../utils/account-api';

test.describe('DELETE /Account/v1/User/{UUID}', () => {
  test('API-ACC-006 - should delete an authenticated user successfully', async ({
    request,
  }) => {
    const testUser =
      await createAuthenticatedTestUser(request);

    const deleteUserResponse = await deleteTestUser(
      request,
      testUser.userID,
      testUser.token,
    );

    expect(deleteUserResponse.status()).toBe(204);

    const deleteResponseBody =
      await deleteUserResponse.text();

    expect(deleteResponseBody).toBe('');

    const deletedUserResponse = await request.get(
      `/Account/v1/User/${testUser.userID}`,
      {
        headers: {
          Authorization: `Bearer ${testUser.token}`,
        },
      },
    );

    expect(deletedUserResponse.status()).toBe(401);

    expect(
      deletedUserResponse.headers()['content-type'],
    ).toContain('application/json');

    const deletedUserResponseBody =
      (await deletedUserResponse.json()) as ApiErrorResponse;

    expect(deletedUserResponseBody).toEqual(
      userNotFoundError,
    );
  });
});