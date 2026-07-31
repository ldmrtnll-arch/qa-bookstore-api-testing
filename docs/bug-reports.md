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

## BUG-API-002 — Generated JWT exposes the user's password in its payload

| Field | Details |
|---|---|
| Bug ID | BUG-API-002 |
| Related test case | API-AUTH-001 |
| Endpoint | `POST /Account/v1/GenerateToken` |
| Severity | High |
| Priority | High |
| Status | Open |
| Environment | DemoQA Book Store API |
| Observed on | 2026-07-31 |

### Description

The JWT generated after successful authentication includes the user's password
inside its payload.

JWT payloads are encoded and can be decoded by anyone who obtains the token.
They are not encrypted by default.

Consequently, exposing the password in the payload may reveal the user's
credentials if the token is accessed through application logs, browser storage,
monitoring tools, network captures, or another unintended location.

### Preconditions

- A valid user exists in the Book Store API.
- The client has the username and password of that user.
- The API is available.

### Steps to reproduce

1. Create a valid user through:

   ```http
   POST /Account/v1/User
   ```

2. Generate a token using the same credentials:

   ```http
   POST /Account/v1/GenerateToken
   ```

3. Copy the generated JWT.
4. Decode the second JWT segment, which represents the payload.
5. Inspect the decoded fields.

### Expected result

The JWT payload should contain only the minimum claims necessary for
authentication and authorization.

Sensitive credentials such as the user's password must not be included.

Example of an acceptable payload:

```json
{
  "sub": "<user-id>",
  "userName": "<username>",
  "iat": 1785512952,
  "exp": 1786117752
}
```

### Actual result

The decoded JWT payload contains the user's password.

The sensitive values below are intentionally redacted:

```json
{
  "userName": "[REDACTED]",
  "password": "[REDACTED]",
  "iat": 1785512952
}
```

### Request example

```http
POST /Account/v1/GenerateToken
Content-Type: application/json
```

```json
{
  "userName": "<valid-username>",
  "password": "<valid-password>"
}
```

### Impact

If the JWT is exposed, an unauthorized person may decode the payload and obtain
the user's password.

This creates additional risk because the same credentials may be used to:

- authenticate as the affected user;
- access other protected API resources;
- compromise accounts where the password was reused;
- maintain access even after the original token expires;
- expose credentials through logs or monitoring systems.

### Frequency

The issue was observed during the successful execution of `API-AUTH-001` on
2026-07-31.

### Workaround

There is no complete client-side workaround because the sensitive information
is added by the API when the token is generated.

Clients should avoid logging, displaying, or storing the complete token in
unprotected locations.

### Evidence handling

The complete JWT and password are intentionally not included in this public
repository.

The payload was inspected locally, and all sensitive values were redacted
before documentation.

### Automation status

The related automated scenario remains active:

```text
API-AUTH-001 - should generate a token with valid credentials
```

The automated test validates the token structure and successful generation but
does not print the token in execution logs.

### Suggested fix

Remove the password claim from the JWT payload.

The token should contain only non-sensitive claims required to identify the
user and enforce authorization, such as:

- user identifier;
- username, when necessary;
- issued-at timestamp;
- expiration timestamp;
- roles or permissions, when applicable.

After the change, invalidate previously issued tokens and review logs or systems
where the affected tokens may have been stored.

---

## Bug summary

| Bug ID | Description | Severity | Priority | Status | Related test |
|---|---|---:|---:|---|---|
| BUG-API-001 | Endpoint does not respond when the ISBN parameter is omitted | Medium | Medium | Open | API-BKS-005 |
| BUG-API-002 | Generated JWT exposes the user's password in its payload | High | High | Open | API-AUTH-001 |
