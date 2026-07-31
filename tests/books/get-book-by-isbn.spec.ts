import { expect, test } from '@playwright/test';
import {
  unavailableBook,
  validBook,
} from '../../test-data/books-data';
import type { ApiErrorResponse } from '../../types/api-error';
import type { Book } from '../../types/book';

test.describe('GET /BookStore/v1/Book', () => {
  test('should return the requested book when the ISBN exists', async ({
    request,
  }) => {
    const response = await request.get('/BookStore/v1/Book', {
      params: {
        ISBN: validBook.isbn,
      },
    });

    expect(response.status()).toBe(200);

    expect(response.headers()['content-type']).toContain(
      'application/json',
    );

    const responseBody = (await response.json()) as Book;

    expect(responseBody.isbn).toBe(validBook.isbn);
    expect(responseBody.title).toBe(validBook.title);
    expect(responseBody.author).toBe(validBook.author);
    expect(responseBody.publisher).toBe(validBook.publisher);

    expect(responseBody.pages).toBeGreaterThan(0);

    expect(
      Number.isNaN(Date.parse(responseBody.publish_date)),
      'publish_date should be a valid date',
    ).toBe(false);

    expect(responseBody.website).toMatch(/^https?:\/\/.+/);
  });

  test('should return an error when the ISBN does not exist', async ({
    request,
  }) => {
    const response = await request.get('/BookStore/v1/Book', {
      params: {
        ISBN: unavailableBook.isbn,
      },
    });

    expect(response.status()).toBe(400);

    expect(response.headers()['content-type']).toContain(
      'application/json',
    );

    const responseBody =
      (await response.json()) as ApiErrorResponse;

    expect(responseBody).toEqual(
      unavailableBook.expectedError,
    );
  });
});