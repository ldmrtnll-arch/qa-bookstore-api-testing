import { expect, test } from '@playwright/test';
import type { BooksResponse } from '../../types/book';
import type {
  AddBooksRequest,
  AddBooksResponse,
} from '../../types/book-collection';
import type { UserDetailsResponse } from '../../types/user-details';
import {
  cleanupTestUser,
  createAuthenticatedTestUser,
} from '../../utils/account-api';

test.describe('POST /BookStore/v1/Books', () => {
  test('API-COL-001 - should add an available book to an authenticated user collection', async ({
    request,
  }) => {
    const testUser =
      await createAuthenticatedTestUser(request);

    try {
      const catalogResponse = await request.get(
        '/BookStore/v1/Books',
      );

      expect(catalogResponse.status()).toBe(200);

      expect(
        catalogResponse.headers()['content-type'],
      ).toContain('application/json');

      const catalog =
        (await catalogResponse.json()) as BooksResponse;

      expect(
        catalog.books.length,
        'The catalog should contain at least one available book',
      ).toBeGreaterThan(0);

      const selectedBook = catalog.books[0];

      const requestBody: AddBooksRequest = {
        userId: testUser.userID,
        collectionOfIsbns: [
          {
            isbn: selectedBook.isbn,
          },
        ],
      };

      const addBookResponse = await request.post(
        '/BookStore/v1/Books',
        {
          headers: {
            Authorization: `Bearer ${testUser.token}`,
          },
          data: requestBody,
        },
      );

      expect(addBookResponse.status()).toBe(201);

      expect(
        addBookResponse.headers()['content-type'],
      ).toContain('application/json');

      const addBookResponseBody =
        (await addBookResponse.json()) as AddBooksResponse;

      expect(addBookResponseBody.books).toEqual([
        {
          isbn: selectedBook.isbn,
        },
      ]);

      const getUserResponse = await request.get(
        `/Account/v1/User/${testUser.userID}`,
        {
          headers: {
            Authorization: `Bearer ${testUser.token}`,
          },
        },
      );

      expect(getUserResponse.status()).toBe(200);

      expect(
        getUserResponse.headers()['content-type'],
      ).toContain('application/json');

      const userResponseBody =
        (await getUserResponse.json()) as UserDetailsResponse;

      expect(userResponseBody.userId).toBe(
        testUser.userID,
      );

      expect(userResponseBody.username).toBe(
        testUser.credentials.userName,
      );

      expect(userResponseBody.books).toHaveLength(1);

      expect(userResponseBody.books[0]).toEqual(
        selectedBook,
      );

      expect(userResponseBody.books[0].isbn).toBe(
        selectedBook.isbn,
      );
    } finally {
      await cleanupTestUser(
        request,
        testUser.userID,
        testUser.token,
      );
    }
  });
});