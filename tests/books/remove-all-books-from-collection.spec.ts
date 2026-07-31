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

test.describe('DELETE /BookStore/v1/Books', () => {
  test('API-COL-009 - should remove all books from the authenticated user collection', async ({
    request,
  }) => {
    const testUser =
      await createAuthenticatedTestUser(request);

    try {
      const { body: catalog } =
        await getBookCatalog(request);

      expect(
        catalog.books.length,
        'The catalog should contain at least two available books',
      ).toBeGreaterThanOrEqual(2);

      const firstBook = catalog.books[0];
      const secondBook = catalog.books[1];

      expect(
        firstBook.isbn,
        'The selected books should have different ISBNs',
      ).not.toBe(secondBook.isbn);

      const firstAddition =
        await addBookToUserCollection(
          request,
          testUser.userID,
          testUser.token,
          firstBook.isbn,
        );

      expect(
        firstAddition.response.status(),
        'The first book should be added successfully',
      ).toBe(201);

      const secondAddition =
        await addBookToUserCollection(
          request,
          testUser.userID,
          testUser.token,
          secondBook.isbn,
        );

      expect(
        secondAddition.response.status(),
        'The second book should be added successfully',
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

      expect(
        userBeforeRemoval.books,
        'The user collection should contain two books before removal',
      ).toHaveLength(2);

      const booksBeforeRemoval =
        userBeforeRemoval.books.map(
          (book) => book.isbn,
        );

      expect(booksBeforeRemoval).toContain(
        firstBook.isbn,
      );

      expect(booksBeforeRemoval).toContain(
        secondBook.isbn,
      );

      const removeAllBooksResponse =
        await request.delete(
          `/BookStore/v1/Books?UserId=${testUser.userID}`,
          {
            headers: {
              Authorization: `Bearer ${testUser.token}`,
            },
          },
        );

      expect(
        removeAllBooksResponse.status(),
      ).toBe(204);

      expect(
        removeAllBooksResponse.headers()[
          'content-type'
        ],
        'A successful 204 response should not provide a content type',
      ).toBeUndefined();

      expect(
        await removeAllBooksResponse.text(),
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

      expect(userAfterRemoval.username).toBe(
        testUser.credentials.userName,
      );

      expect(
        userAfterRemoval.books,
        'All books should be removed from the user collection',
      ).toHaveLength(0);

      expect(
        userAfterRemoval.books.some(
          (book) =>
            book.isbn === firstBook.isbn ||
            book.isbn === secondBook.isbn,
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