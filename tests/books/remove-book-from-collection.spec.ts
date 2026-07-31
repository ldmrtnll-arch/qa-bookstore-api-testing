import { expect, test } from '@playwright/test';
import {
  bookNotInUserCollectionError,
  userNotAuthorizedError,
} from '../../test-data/book-collection-data';
import type { ApiErrorResponse } from '../../types/api-error';
import {
  cleanupTestUser,
  createAuthenticatedTestUser,
} from '../../utils/account-api';
import {
  addBookToUserCollection,
  getBookCatalog,
  getUserDetails,
} from '../../utils/bookstore-api';

test.describe('DELETE /BookStore/v1/Book', () => {
  test('API-COL-006 - should remove a book from the authenticated user collection', async ({
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

      const addBookResult =
        await addBookToUserCollection(
          request,
          testUser.userID,
          testUser.token,
          selectedBook.isbn,
        );

      expect(
        addBookResult.response.status(),
        'The book should be added before the removal attempt',
      ).toBe(201);

      const {
        response: userBeforeRemovalResponse,
        body: userBeforeRemoval,
      } = await getUserDetails(
        request,
        testUser.userID,
        testUser.token,
      );

      expect(
        userBeforeRemovalResponse.status(),
      ).toBe(200);

      expect(userBeforeRemoval.books).toHaveLength(1);

      expect(userBeforeRemoval.books[0].isbn).toBe(
        selectedBook.isbn,
      );

      const removeBookResponse =
        await request.delete('/BookStore/v1/Book', {
          headers: {
            Authorization: `Bearer ${testUser.token}`,
          },
          data: {
            isbn: selectedBook.isbn,
            userId: testUser.userID,
          },
        });

      expect(removeBookResponse.status()).toBe(204);

      expect(
        await removeBookResponse.text(),
        'A successful 204 response should not contain a body',
      ).toBe('');

      const {
        response: userAfterRemovalResponse,
        body: userAfterRemoval,
      } = await getUserDetails(
        request,
        testUser.userID,
        testUser.token,
      );

      expect(
        userAfterRemovalResponse.status(),
      ).toBe(200);

      expect(userAfterRemoval.userId).toBe(
        testUser.userID,
      );

      expect(
        userAfterRemoval.books,
        'The removed book should no longer be present in the user collection',
      ).toHaveLength(0);

      expect(
        userAfterRemoval.books.some(
          (book) => book.isbn === selectedBook.isbn,
        ),
      ).toBe(false);
    } finally {
      await cleanupTestUser(
        request,
        testUser.userID,
        testUser.token,
      );
    }
  });

      test('API-COL-007 - should reject removing a book that is not in the user collection', async ({
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

      const {
        response: userBeforeRemovalResponse,
        body: userBeforeRemoval,
      } = await getUserDetails(
        request,
        testUser.userID,
        testUser.token,
      );

      expect(
        userBeforeRemovalResponse.status(),
      ).toBe(200);

      expect(
        userBeforeRemoval.books,
        'The user collection should initially be empty',
      ).toHaveLength(0);

      const removeBookResponse =
        await request.delete('/BookStore/v1/Book', {
          headers: {
            Authorization: `Bearer ${testUser.token}`,
          },
          data: {
            isbn: selectedBook.isbn,
            userId: testUser.userID,
          },
        });

      expect(removeBookResponse.status()).toBe(400);

      expect(
        removeBookResponse.headers()['content-type'],
      ).toContain('application/json');

      const responseBody =
        (await removeBookResponse.json()) as ApiErrorResponse;

      expect(responseBody).toEqual(
        bookNotInUserCollectionError,
      );

      expect(responseBody.code).toBe('1206');

      expect(responseBody.message).toBe(
        "ISBN supplied is not available in User's Collection!",
      );

      const {
        response: userAfterRemovalResponse,
        body: userAfterRemoval,
      } = await getUserDetails(
        request,
        testUser.userID,
        testUser.token,
      );

      expect(
        userAfterRemovalResponse.status(),
      ).toBe(200);

      expect(userAfterRemoval.userId).toBe(
        testUser.userID,
      );

      expect(
        userAfterRemoval.books,
        'The failed removal should not change the user collection',
      ).toHaveLength(0);
    } finally {
      await cleanupTestUser(
        request,
        testUser.userID,
        testUser.token,
      );
    }
  });

      test('API-COL-008 - should reject removing a book without an authentication token', async ({
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

      const addBookResult =
        await addBookToUserCollection(
          request,
          testUser.userID,
          testUser.token,
          selectedBook.isbn,
        );

      expect(
        addBookResult.response.status(),
        'The book should be added before the unauthorized removal attempt',
      ).toBe(201);

      const removeBookResponse =
        await request.delete('/BookStore/v1/Book', {
          data: {
            isbn: selectedBook.isbn,
            userId: testUser.userID,
          },
        });

      expect(removeBookResponse.status()).toBe(401);

      expect(
        removeBookResponse.headers()['content-type'],
      ).toContain('application/json');

      const responseBody =
        (await removeBookResponse.json()) as ApiErrorResponse;

      expect(responseBody).toEqual(
        userNotAuthorizedError,
      );

      expect(responseBody.code).toBe('1200');

      expect(responseBody.message).toBe(
        'User not authorized!',
      );

      const {
        response: userAfterRemovalResponse,
        body: userAfterRemoval,
      } = await getUserDetails(
        request,
        testUser.userID,
        testUser.token,
      );

      expect(
        userAfterRemovalResponse.status(),
      ).toBe(200);

      expect(userAfterRemoval.userId).toBe(
        testUser.userID,
      );

      expect(
        userAfterRemoval.books,
        'The unauthorized removal should not change the user collection',
      ).toHaveLength(1);

      expect(userAfterRemoval.books[0].isbn).toBe(
        selectedBook.isbn,
      );

      expect(
        userAfterRemoval.books.some(
          (book) => book.isbn === selectedBook.isbn,
        ),
      ).toBe(true);
    } finally {
      await cleanupTestUser(
        request,
        testUser.userID,
        testUser.token,
      );
    }
  });
});