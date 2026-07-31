import { expect, test } from '@playwright/test';
import type { Book, BooksResponse } from '../../types/book';

function expectNonEmptyString(
  value: unknown,
  fieldName: string,
): void {
  expect.soft(
    typeof value,
    `${fieldName} should be a string`,
  ).toBe('string');

  if (typeof value === 'string') {
    expect.soft(
      value.trim().length,
      `${fieldName} should not be empty`,
    ).toBeGreaterThan(0);
  }
}

function validateBook(book: Book, index: number): void {
  const bookPath = `books[${index}]`;

  expectNonEmptyString(book.isbn, `${bookPath}.isbn`);
  expectNonEmptyString(book.title, `${bookPath}.title`);
  expectNonEmptyString(book.subTitle, `${bookPath}.subTitle`);
  expectNonEmptyString(book.author, `${bookPath}.author`);
  expectNonEmptyString(book.publish_date, `${bookPath}.publish_date`);
  expectNonEmptyString(book.publisher, `${bookPath}.publisher`);
  expectNonEmptyString(book.description, `${bookPath}.description`);
  expectNonEmptyString(book.website, `${bookPath}.website`);

  expect.soft(
    Number.isInteger(book.pages),
    `${bookPath}.pages should be an integer`,
  ).toBe(true);

  expect.soft(
    book.pages,
    `${bookPath}.pages should be greater than zero`,
  ).toBeGreaterThan(0);

  expect.soft(
    Number.isNaN(Date.parse(book.publish_date)),
    `${bookPath}.publish_date should be a valid date`,
  ).toBe(false);

  expect.soft(
    book.website,
    `${bookPath}.website should be an HTTP or HTTPS URL`,
  ).toMatch(/^https?:\/\/.+/);
}

test.describe('GET /BookStore/v1/Books', () => {
  test('should return the available books successfully', async ({
    request,
  }) => {
    const response = await request.get('/BookStore/v1/Books');

    expect(response.status()).toBe(200);

    expect(response.headers()['content-type']).toContain(
      'application/json',
    );

    const responseBody = (await response.json()) as BooksResponse;

    expect(responseBody).toHaveProperty('books');
    expect(Array.isArray(responseBody.books)).toBe(true);
    expect(responseBody.books.length).toBeGreaterThan(0);

    for (const [index, book] of responseBody.books.entries()) {
      validateBook(book, index);
    }

    const returnedIsbns = responseBody.books.map(
      (book) => book.isbn,
    );

    const uniqueIsbns = new Set(returnedIsbns);

    expect(
      uniqueIsbns.size,
      'The catalog should not contain duplicated ISBNs',
    ).toBe(returnedIsbns.length);
  });
});