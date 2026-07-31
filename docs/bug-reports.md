# Bug Reports

This document contains the defects identified during the testing of the DemoQA Book Store API.

---

## BUG-API-001 — Book endpoint does not respond when the ISBN parameter is omitted

| Field | Details |
|---|---|
| Bug ID | BUG-API-001 |
| Related test case | API-BKS-005 |
| Endpoint | `GET /BookStore/v1/Book` |
| Severity | Medium |
| Priority | Medium |
| Status | Open |
| Environment | DemoQA Book Store API |
| Observed on | 2026-07-31 |

### Description

The endpoint does not return a controlled HTTP response when the required
`ISBN` query parameter is omitted.

The request remains pending until the automated test reaches its 30-second
timeout.

### Preconditions

- The DemoQA Book Store API is available.
- The client can send HTTPS requests to the API.
- No authentication is required to query a book by ISBN.

### Steps to reproduce

1. Send a GET request to the following endpoint:

   ```http
   GET /BookStore/v1/Book
   ```

2. Do not include the required `ISBN` query parameter.
3. Wait for the API response.

### Expected result

The API should return a controlled client error without unnecessary delay.

Example:

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json
```

The response body should clearly indicate that the required `ISBN` parameter
was not provided.

Example response:

```json
{
  "code": "1205",
  "message": "ISBN parameter is required."
}
```

### Actual result

The API does not return a response within 30 seconds.

The Playwright request is interrupted when the test timeout is reached:

```text
Test timeout of 30000ms exceeded.

Error: apiRequestContext.get: Request context disposed.
```

### Reproduction command

```powershell
npx playwright test tests/books/get-book-by-isbn.spec.ts --grep "API-BKS-005"
```

### Request

```http
GET https://bookstore.toolsqa.com/BookStore/v1/Book
Accept: application/json
Content-Type: application/json
```

### Impact

Clients that accidentally omit the required parameter may remain waiting for a
response instead of receiving an immediate validation error.

This behavior can cause:

- unnecessary resource consumption;
- slower error handling;
- poor client experience;
- requests remaining pending until the client-side timeout is reached;
- delays in applications that depend on this endpoint.

### Frequency

The issue was reproduced during the exploratory API test executed on
2026-07-31.

### Workaround

Validate the presence of the `ISBN` parameter on the client side before sending
the request.

The automated scenario is currently marked with `test.fixme` so the known API
issue does not block the remaining test suite.

### Evidence

Request sent without the required query parameter:

```text
GET https://bookstore.toolsqa.com/BookStore/v1/Book
```

Observed Playwright result:

```text
Test timeout of 30000ms exceeded.

Error: apiRequestContext.get: Request context disposed.

Call log:
  - GET https://bookstore.toolsqa.com/BookStore/v1/Book
```

### Automation status

The related automated test is documented as:

```text
API-BKS-005 - should return a validation error when the ISBN parameter is missing
```

The scenario is marked with:

```typescript
test.fixme(
  true,
  'BUG-API-001: endpoint does not respond when the ISBN parameter is omitted',
);
```

### Suggested fix

Validate the `ISBN` query parameter before attempting to search the book
collection.

When the parameter is missing, the API should immediately return a controlled
`400 Bad Request` response with a clear and consistent error body.

---

## Bug summary

| Bug ID | Description | Severity | Priority | Status | Related test |
|---|---|---:|---:|---|---|
| BUG-API-001 | Endpoint does not respond when the ISBN parameter is omitted | Medium | Medium | Open | API-BKS-005 |