import { expect, test } from '@playwright/test';

test.describe('GET /BookStore/v1/Books', () => {
  test('should return the available books successfully', async ({ request }) => {
    const response = await request.get('/BookStore/v1/Books');

    expect(response.status()).toBe(200);

    const contentType = response.headers()['content-type'];

    expect(contentType).toContain('application/json');

    const responseBody = await response.json();

    expect(responseBody).toHaveProperty('books');
    expect(Array.isArray(responseBody.books)).toBe(true);
    expect(responseBody.books.length).toBeGreaterThan(0);
  });
});