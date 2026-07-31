import { expect, test } from '@playwright/test';
import {
  isbnNotAvailableError,
  unavailableBook,
  validBook,
} from '../../test-data/books-data';
import type { ApiErrorResponse } from '../../types/api-error';
import type { Book } from '../../types/book';

test.describe('GET /BookStore/v1/Book', () => {
  test('API-BKS-002 - should return the requested book when the ISBN exists', async ({
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

  test('API-BKS-003 - should return an error when the ISBN does not exist', async ({
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

  test('API-BKS-004 - should return an error when the ISBN is empty', async ({
    request,
  }) => {
    const response = await request.get('/BookStore/v1/Book', {
      params: {
        ISBN: '',
      },
    });

    expect(response.status()).toBe(400);

    expect(response.headers()['content-type']).toContain(
      'application/json',
    );

    const responseBody =
      (await response.json()) as ApiErrorResponse;

    expect(responseBody).toEqual(isbnNotAvailableError);
  });

  test('API-BKS-005 - should return a validation error when the ISBN parameter is missing', async ({
    request,
  }) => {
    test.fixme(
      true,
      'BUG-API-001: endpoint does not respond when the ISBN parameter is omitted',
    );

    const response = await request.get('/BookStore/v1/Book');

    expect(response.status()).toBe(400);

    expect(response.headers()['content-type']).toContain(
      'application/json',
    );
  });
});