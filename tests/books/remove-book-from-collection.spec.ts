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
});