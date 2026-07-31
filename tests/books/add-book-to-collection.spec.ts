import { expect, test } from '@playwright/test';
import {
  cleanupTestUser,
  createAuthenticatedTestUser,
} from '../../utils/account-api';
import {
  addBookToUserCollection,
  getBookCatalog,
  getUserDetails,
} from '../../utils/bookstore-api';
import { userNotAuthorizedError } from '../../test-data/book-collection-data';
import type { ApiErrorResponse } from '../../types/api-error';

test.describe('POST /BookStore/v1/Books', () => {
  test('API-COL-001 - should add an available book to an authenticated user collection', async ({
    request,
  }) => {
    const testUser =
      await createAuthenticatedTestUser(request);

    try {
      const {
        response: catalogResponse,
        body: catalog,
      } = await getBookCatalog(request);

      expect(catalogResponse.status()).toBe(200);

      expect(
        catalogResponse.headers()['content-type'],
      ).toContain('application/json');

      expect(
        catalog.books.length,
        'The catalog should contain at least one available book',
      ).toBeGreaterThan(0);

      const selectedBook = catalog.books[0];

      const {
        response: addBookResponse,
        body: addBookResponseBody,
      } = await addBookToUserCollection(
        request,
        testUser.userID,
        testUser.token,
        selectedBook.isbn,
      );

      expect(addBookResponse.status()).toBe(201);

      expect(
        addBookResponse.headers()['content-type'],
      ).toContain('application/json');

      expect(addBookResponseBody.books).toEqual([
        {
          isbn: selectedBook.isbn,
        },
      ]);

      const {
        response: getUserResponse,
        body: userResponseBody,
      } = await getUserDetails(
        request,
        testUser.userID,
        testUser.token,
      );

      expect(getUserResponse.status()).toBe(200);

      expect(
        getUserResponse.headers()['content-type'],
      ).toContain('application/json');

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

      test('API-COL-002 - should reject adding a book without an authentication token', async ({
    request,
  }) => {
    const testUser =
      await createAuthenticatedTestUser(request);

    try {
      const { body: catalog } =
        await getBookCatalog(request);

      expect(
        catalog.books.length,
        'The catalog should contain at least one available book',
      ).toBeGreaterThan(0);

      const selectedBook = catalog.books[0];

      const response = await request.post(
        '/BookStore/v1/Books',
        {
          data: {
            userId: testUser.userID,
            collectionOfIsbns: [
              {
                isbn: selectedBook.isbn,
              },
            ],
          },
        },
      );

      expect(response.status()).toBe(401);

      expect(
        response.headers()['content-type'],
      ).toContain('application/json');

      const responseBody =
        (await response.json()) as ApiErrorResponse;

      expect(responseBody).toEqual(
        userNotAuthorizedError,
      );

      expect(responseBody.code).toBe('1200');
      expect(responseBody.message).toBe(
        'User not authorized!',
      );

      const {
        response: getUserResponse,
        body: userResponseBody,
      } = await getUserDetails(
        request,
        testUser.userID,
        testUser.token,
      );

      expect(getUserResponse.status()).toBe(200);

      expect(
        userResponseBody.books,
        'The failed request should not persist a book in the user collection',
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