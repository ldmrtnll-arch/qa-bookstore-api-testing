# API Test Cases

## Document Information

| Field | Value |
|---|---|
| Project | QA Bookstore API Testing |
| Application | DemoQA Book Store API |
| Document type | API test cases |
| Test levels | API, integration and contract testing |
| Automation tools | Playwright API and Bruno |
| Language | TypeScript |
| Status | In progress |

---

## 1. Purpose

This document describes the API test cases implemented for the DemoQA Book Store API.

The test cases validate:

- HTTP status codes;
- response headers;
- response body content;
- JSON response contracts;
- authentication and authorization rules;
- account lifecycle;
- book catalog operations;
- user collection operations;
- persistence and consistency of data;
- error handling;
- cleanup of test data.

Each automated test uses a unique identifier that connects the documented scenario to the corresponding Playwright test.

---

## 2. Test Case Structure

Each test case contains:

- identifier;
- title;
- endpoint;
- HTTP method;
- test type;
- priority;
- preconditions;
- test data;
- execution steps;
- expected results;
- automation status.

Valid test passwords are loaded from the `BOOKSTORE_TEST_PASSWORD` environment variable.

Real passwords and authentication tokens must not be stored in source code, documentation, logs or execution evidence.

---

## 3. Account Test Cases

### API-ACC-001 — Create a user with valid credentials

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/User` |
| Method | `POST` |
| Test type | Positive, functional and contract |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/create-user.spec.ts` |

#### Preconditions

- The Book Store API is available.
- `BOOKSTORE_TEST_PASSWORD` contains a valid password that meets the API password policy.
- The generated username does not already exist.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Dynamically generated unique username |
| `password` | Value loaded from `BOOKSTORE_TEST_PASSWORD` |

#### Steps

1. Generate a unique username.
2. Send a `POST` request to `/Account/v1/User`.
3. Include the generated username and valid password in the request body.
4. Read the response status, headers and body.
5. Delete the created user during test cleanup.

#### Expected Results

- The response status is `201 Created`.
- The `Content-Type` header contains `application/json`.
- The response matches the created-user JSON contract.
- `userID` contains a valid UUID.
- `username` matches the username sent in the request.
- `books` is an empty array.
- The created user can be removed during cleanup.

---

### API-ACC-002 — Reject the creation of a duplicated user

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/User` |
| Method | `POST` |
| Test type | Negative and business rule |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/create-user.spec.ts` |

#### Preconditions

- The Book Store API is available.
- `BOOKSTORE_TEST_PASSWORD` contains a valid password.
- A unique username can be generated.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Dynamically generated unique username |
| `password` | Value loaded from `BOOKSTORE_TEST_PASSWORD` |

#### Steps

1. Generate a unique username.
2. Create a user using the generated username and valid password.
3. Confirm that the first request returns `201 Created`.
4. Send another `POST` request to `/Account/v1/User`.
5. Use exactly the same username and password.
6. Read the second response.
7. Delete the original user during cleanup.

#### Expected Results

- The first user creation returns `201 Created`.
- The duplicated user request returns `406 Not Acceptable`.
- The response `Content-Type` contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1204`.
- The response message is `User exists!`.
- No second user is created.

---

### API-ACC-003 — Reject a password that does not meet the requirements

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/User` |
| Method | `POST` |
| Test type | Negative, validation and boundary |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/create-user.spec.ts` |

#### Preconditions

- The Book Store API is available.
- The generated username does not already exist.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Dynamically generated unique username |
| `password` | A deliberately weak password |

#### Steps

1. Generate a unique username.
2. Prepare a password that does not meet the API password policy.
3. Send a `POST` request to `/Account/v1/User`.
4. Include the generated username and weak password in the request body.
5. Read the response status, headers and body.

#### Expected Results

- The response status is `400 Bad Request`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1300`.
- The response message explains the password requirements.
- No user is created.

---

### API-ACC-004 — Reject user creation with an empty username

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/User` |
| Method | `POST` |
| Test type | Negative and required-field validation |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/create-user.spec.ts` |

#### Preconditions

- The Book Store API is available.
- `BOOKSTORE_TEST_PASSWORD` contains a valid password.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Empty string |
| `password` | Value loaded from `BOOKSTORE_TEST_PASSWORD` |

#### Steps

1. Prepare a request body with an empty username.
2. Include a valid password.
3. Send a `POST` request to `/Account/v1/User`.
4. Read the response status, headers and body.

#### Expected Results

- The response status is `400 Bad Request`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1200`.
- The response message is `UserName and Password required.`.
- No user is created.

---

### API-ACC-005 — Reject user creation with an empty password

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/User` |
| Method | `POST` |
| Test type | Negative and required-field validation |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/create-user.spec.ts` |

#### Preconditions

- The Book Store API is available.
- The generated username does not already exist.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Dynamically generated unique username |
| `password` | Empty string |

#### Steps

1. Generate a unique username.
2. Prepare a request body with the generated username.
3. Use an empty password.
4. Send a `POST` request to `/Account/v1/User`.
5. Read the response status, headers and body.

#### Expected Results

- The response status is `400 Bad Request`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1200`.
- The response message is `UserName and Password required.`.
- No user is created.

---

### API-ACC-006 — Delete an authenticated user successfully

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/User/{UUID}` |
| Method | `DELETE` |
| Test type | Positive, functional, integration and data consistency |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/delete-user.spec.ts` |

#### Preconditions

- The Book Store API is available.
- `BOOKSTORE_TEST_PASSWORD` contains a valid password.
- A test user has been created.
- A valid authentication token has been generated for the test user.
- The user UUID is available.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Dynamically generated unique username |
| `password` | Value loaded from `BOOKSTORE_TEST_PASSWORD` |
| `userId` | UUID returned during user creation |
| `Authorization` | Valid Bearer token generated for the user |

#### Steps

1. Generate a unique username.
2. Create a test user.
3. Generate a valid authentication token.
4. Send a `DELETE` request to `/Account/v1/User/{UUID}`.
5. Include the created user's UUID in the path.
6. Include the valid Bearer token in the request headers.
7. Read the response status and body.
8. Send a `GET` request for the same user using the previous token.

#### Expected Results

- The deletion response status is `204 No Content`.
- The deletion response body is empty.
- A subsequent request for the deleted user returns `401 Unauthorized`.
- The error response contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1207`.
- The response message is `User not found!`.
- The deleted user is no longer available through the API.

---

### API-ACC-007 — Return the authenticated user details

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/User/{UUID}` |
| Method | `GET` |
| Test type | Positive, functional, contract and integration |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/get-user.spec.ts` |

#### Preconditions

- The Book Store API is available.
- `BOOKSTORE_TEST_PASSWORD` contains a valid password.
- A test user has been created.
- A valid authentication token has been generated for the user.
- The user UUID is available.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Dynamically generated unique username |
| `password` | Value loaded from `BOOKSTORE_TEST_PASSWORD` |
| `userId` | UUID returned during user creation |
| `Authorization` | Valid Bearer token generated for the user |

#### Steps

1. Generate a unique username.
2. Create a test user.
3. Generate a valid authentication token.
4. Send a `GET` request to `/Account/v1/User/{UUID}`.
5. Include the created user's UUID in the path.
6. Include the valid Bearer token in the request headers.
7. Read the response status, headers and body.
8. Delete the test user during cleanup.

#### Expected Results

- The response status is `200 OK`.
- The `Content-Type` header contains `application/json`.
- The response matches the user-details JSON contract.
- `userId` contains the UUID returned during user creation.
- `username` matches the generated username.
- `books` is an array.
- The newly created user collection is empty.
- The test user can be deleted during cleanup.

---

## 4. Token Generation Test Cases

### API-AUTH-001 — Generate a token with valid credentials

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/GenerateToken` |
| Method | `POST` |
| Test type | Positive, functional, contract and security |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/generate-token.spec.ts` |

#### Preconditions

- The Book Store API is available.
- `BOOKSTORE_TEST_PASSWORD` contains a valid password.
- A test user has been created successfully.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Dynamically generated unique username |
| `password` | Value loaded from `BOOKSTORE_TEST_PASSWORD` |

#### Steps

1. Generate a unique username.
2. Create a test user using valid credentials.
3. Send a `POST` request to `/Account/v1/GenerateToken`.
4. Include the created username and valid password in the request body.
5. Read the response status, headers and body.
6. Validate the generated token and expiration date.
7. Delete the test user during cleanup.

#### Expected Results

- The response status is `200 OK`.
- The `Content-Type` header contains `application/json`.
- The response matches the successful-token JSON contract.
- `token` contains a non-empty value.
- The token contains three JWT segments separated by dots.
- `expires` contains a valid date and time.
- The expiration date is later than the current execution time.
- `status` is `Success`.
- `result` is `User authorized successfully.`.
- The generated token can be used for authenticated operations.

---

### API-AUTH-002 — Fail token generation with an incorrect password

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/GenerateToken` |
| Method | `POST` |
| Test type | Negative, authentication and contract |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/generate-token.spec.ts` |

#### Preconditions

- The Book Store API is available.
- A test user has been created successfully.
- The correct password is available only for test preparation and cleanup.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Username of the created test user |
| `password` | Deliberately incorrect password |

#### Steps

1. Generate a unique username.
2. Create a test user using valid credentials.
3. Send a `POST` request to `/Account/v1/GenerateToken`.
4. Include the existing username and an incorrect password.
5. Read the response status, headers and body.
6. Generate a valid token using the correct password only for cleanup.
7. Delete the test user.

#### Expected Results

- The response status is `200 OK`.
- The `Content-Type` header contains `application/json`.
- The response matches the failed-token JSON contract.
- `token` is `null`.
- `expires` is `null`.
- `status` is `Failed`.
- `result` indicates that the username or password is incorrect.
- No valid authentication token is generated from the incorrect password.

---

### API-AUTH-003 — Fail token generation for a nonexistent user

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/GenerateToken` |
| Method | `POST` |
| Test type | Negative, authentication and contract |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/generate-token.spec.ts` |

#### Preconditions

- The Book Store API is available.
- The generated username does not exist in the application.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Dynamically generated username that has not been registered |
| `password` | Valid-format password loaded from `BOOKSTORE_TEST_PASSWORD` |

#### Steps

1. Generate a unique username without creating an account.
2. Send a `POST` request to `/Account/v1/GenerateToken`.
3. Include the nonexistent username and a valid-format password.
4. Read the response status, headers and body.

#### Expected Results

- The response status is `200 OK`.
- The `Content-Type` header contains `application/json`.
- The response matches the failed-token JSON contract.
- `token` is `null`.
- `expires` is `null`.
- `status` is `Failed`.
- `result` indicates that the username or password is incorrect.
- No authentication token is generated.

---

### API-AUTH-004 — Reject token generation with an empty username

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/GenerateToken` |
| Method | `POST` |
| Test type | Negative and required-field validation |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/generate-token.spec.ts` |

#### Preconditions

- The Book Store API is available.
- `BOOKSTORE_TEST_PASSWORD` contains a valid password.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Empty string |
| `password` | Value loaded from `BOOKSTORE_TEST_PASSWORD` |

#### Steps

1. Prepare a request body with an empty username.
2. Include a valid password.
3. Send a `POST` request to `/Account/v1/GenerateToken`.
4. Read the response status, headers and body.

#### Expected Results

- The response status is `400 Bad Request`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1200`.
- The response message is `UserName and Password required.`.
- No authentication token is generated.

---

### API-AUTH-005 — Reject token generation with an empty password

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/GenerateToken` |
| Method | `POST` |
| Test type | Negative and required-field validation |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/generate-token.spec.ts` |

#### Preconditions

- The Book Store API is available.
- A username value is available for the request.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Dynamically generated username |
| `password` | Empty string |

#### Steps

1. Generate a unique username.
2. Prepare a request body containing the generated username.
3. Use an empty password.
4. Send a `POST` request to `/Account/v1/GenerateToken`.
5. Read the response status, headers and body.

#### Expected Results

- The response status is `400 Bad Request`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1200`.
- The response message is `UserName and Password required.`.
- No authentication token is generated.

---

## 5. User Authorization Test Cases

### API-AUTH-006 — Authorize the user only after token generation

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/Authorized` |
| Method | `POST` |
| Test type | Positive, integration, authentication and business rule |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/authorized.spec.ts` |

#### Preconditions

- The Book Store API is available.
- `BOOKSTORE_TEST_PASSWORD` contains a valid password.
- A test user has been created successfully.
- No token has been generated yet for the test user.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Dynamically generated unique username |
| `password` | Value loaded from `BOOKSTORE_TEST_PASSWORD` |

#### Steps

1. Generate a unique username.
2. Create a test user using valid credentials.
3. Send a `POST` request to `/Account/v1/Authorized` before generating a token.
4. Include the created username and valid password.
5. Read the response status, headers and body.
6. Generate an authentication token for the same user.
7. Send another `POST` request to `/Account/v1/Authorized`.
8. Use the same username and password.
9. Read the second response.
10. Delete the test user during cleanup.

#### Expected Results

- The authorization request sent before token generation returns `200 OK`.
- The response body before token generation is `false`.
- Token generation succeeds.
- The authorization request sent after token generation returns `200 OK`.
- The response body after token generation is `true`.
- The authorization state changes only after token generation.
- The test user can be deleted during cleanup.

---

### API-AUTH-007 — Return an error when authorizing with an incorrect password

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/Authorized` |
| Method | `POST` |
| Test type | Negative, authentication and error contract |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/authorized.spec.ts` |

#### Preconditions

- The Book Store API is available.
- A test user has been created successfully.
- The valid user password is available only for test preparation and cleanup.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Username of the created test user |
| `password` | Deliberately incorrect password |

#### Steps

1. Generate a unique username.
2. Create a test user using valid credentials.
3. Send a `POST` request to `/Account/v1/Authorized`.
4. Include the existing username and an incorrect password.
5. Read the response status, headers and body.
6. Generate a valid token using the correct password only for cleanup.
7. Delete the test user.

#### Expected Results

- The response status is `404 Not Found`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1207`.
- The response message is `User not found!`.
- The user is not authorized with the incorrect password.

---

### API-AUTH-008 — Return an error when authorizing a nonexistent user

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/Authorized` |
| Method | `POST` |
| Test type | Negative, authentication and error contract |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/authorized.spec.ts` |

#### Preconditions

- The Book Store API is available.
- The generated username does not exist in the application.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Dynamically generated username that has not been registered |
| `password` | Valid-format password loaded from `BOOKSTORE_TEST_PASSWORD` |

#### Steps

1. Generate a unique username without creating an account.
2. Send a `POST` request to `/Account/v1/Authorized`.
3. Include the nonexistent username and a valid-format password.
4. Read the response status, headers and body.

#### Expected Results

- The response status is `404 Not Found`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1207`.
- The response message is `User not found!`.
- The nonexistent user is not authorized.

---

### API-AUTH-009 — Reject authorization with an empty username

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/Authorized` |
| Method | `POST` |
| Test type | Negative and required-field validation |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/authorized.spec.ts` |

#### Preconditions

- The Book Store API is available.
- `BOOKSTORE_TEST_PASSWORD` contains a valid password.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Empty string |
| `password` | Value loaded from `BOOKSTORE_TEST_PASSWORD` |

#### Steps

1. Prepare a request body with an empty username.
2. Include a valid password.
3. Send a `POST` request to `/Account/v1/Authorized`.
4. Read the response status, headers and body.

#### Expected Results

- The response status is `400 Bad Request`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1200`.
- The response message is `UserName and Password required.`.
- The request does not authorize a user.

---

### API-AUTH-010 — Reject authorization with an empty password

| Field | Description |
|---|---|
| Endpoint | `/Account/v1/Authorized` |
| Method | `POST` |
| Test type | Negative and required-field validation |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/account/authorized.spec.ts` |

#### Preconditions

- The Book Store API is available.
- A username value is available for the request.

#### Test Data

| Field | Value |
|---|---|
| `userName` | Dynamically generated username |
| `password` | Empty string |

#### Steps

1. Generate a unique username.
2. Prepare a request body containing the generated username.
3. Use an empty password.
4. Send a `POST` request to `/Account/v1/Authorized`.
5. Read the response status, headers and body.

#### Expected Results

- The response status is `400 Bad Request`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1200`.
- The response message is `UserName and Password required.`.
- The request does not authorize a user.

---

## 6. Book Catalog Test Cases

### API-BKS-001 — Return the available books successfully

| Field | Description |
|---|---|
| Endpoint | `/BookStore/v1/Books` |
| Method | `GET` |
| Test type | Positive, functional, contract and data quality |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/books/get-books.spec.ts` |

#### Preconditions

- The Book Store API is available.
- The book catalog contains at least one book.

#### Test Data

No request body or authentication token is required.

#### Steps

1. Send a `GET` request to `/BookStore/v1/Books`.
2. Read the response status, headers and body.
3. Validate the response against the books-list JSON contract.
4. Validate the required fields of every returned book.
5. Check the collection for duplicated ISBN values.

#### Expected Results

- The response status is `200 OK`.
- The `Content-Type` header contains `application/json`.
- The response matches the books-list JSON contract.
- `books` is a non-empty array.
- Every book contains the required fields.
- Every ISBN is a non-empty string.
- Every title, subtitle, author, publisher, description and website is a string.
- `pages` is an integer greater than zero.
- `publish_date` contains a valid date.
- `website` contains a valid HTTP or HTTPS URL.
- No duplicated ISBN exists in the returned catalog.

---

### API-BKS-002 — Return the requested book when the ISBN exists

| Field | Description |
|---|---|
| Endpoint | `/BookStore/v1/Book` |
| Method | `GET` |
| Test type | Positive, functional, contract and query-parameter validation |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/books/get-book-by-isbn.spec.ts` |

#### Preconditions

- The Book Store API is available.
- The selected ISBN exists in the book catalog.

#### Test Data

| Field | Value |
|---|---|
| Query parameter | `ISBN` |
| ISBN | Existing ISBN defined in reusable book test data |

#### Steps

1. Select a valid book from the reusable test data.
2. Send a `GET` request to `/BookStore/v1/Book`.
3. Include the existing ISBN in the `ISBN` query parameter.
4. Read the response status, headers and body.
5. Validate the response against the single-book JSON contract.
6. Compare the returned book with the expected test data.

#### Expected Results

- The response status is `200 OK`.
- The `Content-Type` header contains `application/json`.
- The response matches the single-book JSON contract.
- The returned `isbn` matches the requested ISBN.
- The returned `title`, `author` and `publisher` match the expected book data.
- `pages` is an integer greater than zero.
- `publish_date` contains a valid date.
- `website` contains a valid HTTP or HTTPS URL.

---

### API-BKS-003 — Return an error when the ISBN does not exist

| Field | Description |
|---|---|
| Endpoint | `/BookStore/v1/Book` |
| Method | `GET` |
| Test type | Negative, functional and error contract |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/books/get-book-by-isbn.spec.ts` |

#### Preconditions

- The Book Store API is available.
- The selected ISBN does not exist in the book catalog.

#### Test Data

| Field | Value |
|---|---|
| Query parameter | `ISBN` |
| ISBN | Unavailable ISBN defined in reusable book test data |

#### Steps

1. Select an ISBN that is not available in the catalog.
2. Send a `GET` request to `/BookStore/v1/Book`.
3. Include the unavailable ISBN in the `ISBN` query parameter.
4. Read the response status, headers and body.
5. Validate the response against the standard API error contract.

#### Expected Results

- The response status is `400 Bad Request`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1205`.
- The response message is `ISBN supplied is not available in Books Collection!`.
- No book object is returned.

---

### API-BKS-004 — Return an error when the ISBN is empty

| Field | Description |
|---|---|
| Endpoint | `/BookStore/v1/Book` |
| Method | `GET` |
| Test type | Negative and required-query-parameter validation |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/books/get-book-by-isbn.spec.ts` |

#### Preconditions

- The Book Store API is available.

#### Test Data

| Field | Value |
|---|---|
| Query parameter | `ISBN` |
| ISBN | Empty string |

#### Steps

1. Prepare the `ISBN` query parameter with an empty value.
2. Send a `GET` request to `/BookStore/v1/Book`.
3. Read the response status, headers and body.
4. Validate the response against the standard API error contract.

#### Expected Results

- The response status is `400 Bad Request`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1205`.
- The response message is `ISBN supplied is not available in Books Collection!`.
- No book object is returned.

---

### API-BKS-005 — Validate the response when the ISBN parameter is missing

| Field | Description |
|---|---|
| Endpoint | `/BookStore/v1/Book` |
| Method | `GET` |
| Test type | Negative, required-query-parameter validation and resilience |
| Priority | High |
| Automation | Implemented with Playwright but currently skipped with `test.fixme` |
| Test file | `tests/books/get-book-by-isbn.spec.ts` |
| Related defect | `BUG-API-001` |

#### Preconditions

- The Book Store API is available.
- The request is sent without the `ISBN` query parameter.

#### Test Data

No `ISBN` query parameter is provided.

#### Steps

1. Send a `GET` request to `/BookStore/v1/Book`.
2. Do not include the `ISBN` query parameter.
3. Wait for the API response within the configured request timeout.
4. Record the response status, headers and body when a response is returned.

#### Expected Results

- The API should return a validation response instead of leaving the request pending.
- The expected validation status is `400 Bad Request`.
- The response should contain `application/json`.
- The response should follow the standard API error contract.
- The response should explain that the ISBN is required or unavailable.
- The request should complete within the configured timeout.

#### Current Behavior

- The endpoint does not complete the request within the expected time.
- The automated test is marked with `test.fixme` to prevent the known behavior from blocking the regression suite.
- The behavior is documented in `BUG-API-001`.
- No passing result is claimed for this scenario.

---

## 7. User Collection Test Cases

### API-COL-001 — Add an available book to an authenticated user collection

| Field | Description |
|---|---|
| Endpoint | `/BookStore/v1/Books` |
| Method | `POST` |
| Test type | Positive, functional, integration, contract and data persistence |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/books/add-book-to-collection.spec.ts` |

#### Preconditions

- The Book Store API is available.
- `BOOKSTORE_TEST_PASSWORD` contains a valid password.
- A test user has been created.
- A valid authentication token has been generated.
- The catalog contains at least one available book.
- The selected book is not already in the user collection.

#### Test Data

| Field | Value |
|---|---|
| `userId` | UUID returned during user creation |
| `Authorization` | Valid Bearer token generated for the user |
| `isbn` | ISBN selected from the current catalog |

#### Steps

1. Create a unique test user.
2. Generate a valid authentication token.
3. Retrieve the available book catalog.
4. Select an available book.
5. Send a `POST` request to `/BookStore/v1/Books`.
6. Include the user UUID and selected ISBN in the request body.
7. Include the valid Bearer token.
8. Read the response status, headers and body.
9. Retrieve the user details after adding the book.
10. Delete the test user during cleanup.

#### Expected Results

- The add-book response status is `201 Created`.
- The `Content-Type` header contains `application/json`.
- The response matches the add-books JSON contract.
- `books` contains one item.
- The returned ISBN matches the selected catalog ISBN.
- The subsequent user-details request returns `200 OK`.
- The persisted user UUID and username match the created user.
- The user collection contains exactly one book.
- The persisted book ISBN matches the selected ISBN.

---

### API-COL-002 — Reject adding a book without an authentication token

| Field | Description |
|---|---|
| Endpoint | `/BookStore/v1/Books` |
| Method | `POST` |
| Test type | Negative, authentication, integration and data consistency |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/books/add-book-to-collection.spec.ts` |

#### Preconditions

- The Book Store API is available.
- A test user has been created.
- A valid token is available only for verification and cleanup.
- An available catalog book has been selected.
- The user collection is initially empty.

#### Test Data

| Field | Value |
|---|---|
| `userId` | UUID returned during user creation |
| `Authorization` | Not provided in the add-book request |
| `isbn` | ISBN selected from the current catalog |

#### Steps

1. Create a unique test user.
2. Generate a valid token for later verification and cleanup.
3. Retrieve the book catalog and select an available book.
4. Send a `POST` request to `/BookStore/v1/Books`.
5. Include the user UUID and selected ISBN.
6. Do not include an authentication token.
7. Read the response status, headers and body.
8. Retrieve the user collection with the valid token.
9. Delete the test user during cleanup.

#### Expected Results

- The add-book response status is `401 Unauthorized`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1200`.
- The response message is `User not authorized!`.
- The subsequent user-details request succeeds with the valid token.
- The user collection remains empty.
- No unauthorized data modification occurs.

---

### API-COL-003 — Reject adding a book with an invalid token

| Field | Description |
|---|---|
| Endpoint | `/BookStore/v1/Books` |
| Method | `POST` |
| Test type | Negative, authentication, integration and data consistency |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/books/add-book-to-collection.spec.ts` |

#### Preconditions

- The Book Store API is available.
- A test user has been created.
- A valid token is available only for verification and cleanup.
- An available catalog book has been selected.
- The user collection is initially empty.

#### Test Data

| Field | Value |
|---|---|
| `userId` | UUID returned during user creation |
| `Authorization` | Deliberately invalid Bearer token |
| `isbn` | ISBN selected from the current catalog |

#### Steps

1. Create a unique test user.
2. Generate a valid token for later verification and cleanup.
3. Retrieve the book catalog and select an available book.
4. Send a `POST` request to `/BookStore/v1/Books`.
5. Include the user UUID and selected ISBN.
6. Include a deliberately invalid Bearer token.
7. Read the response status, headers and body.
8. Retrieve the user collection with the valid token.
9. Delete the test user during cleanup.

#### Expected Results

- The add-book response status is `401 Unauthorized`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1200`.
- The response message is `User not authorized!`.
- The user collection remains empty.
- No data is persisted from the request with the invalid token.

---

### API-COL-004 — Reject adding a duplicated book to the user collection

| Field | Description |
|---|---|
| Endpoint | `/BookStore/v1/Books` |
| Method | `POST` |
| Test type | Negative, business rule, integration and data consistency |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/books/add-book-to-collection.spec.ts` |

#### Preconditions

- The Book Store API is available.
- An authenticated test user has been created.
- An available book has been selected from the catalog.
- The selected book is not initially present in the user collection.

#### Test Data

| Field | Value |
|---|---|
| `userId` | UUID returned during user creation |
| `Authorization` | Valid Bearer token |
| `isbn` | Same available ISBN used in both requests |

#### Steps

1. Create and authenticate a unique test user.
2. Retrieve the catalog and select an available book.
3. Add the selected book to the user collection.
4. Confirm that the first request returns `201 Created`.
5. Send a second add-book request with the same user UUID and ISBN.
6. Read the second response status, headers and body.
7. Retrieve the user collection.
8. Delete the test user during cleanup.

#### Expected Results

- The first request returns `201 Created`.
- The duplicated request returns `400 Bad Request`.
- The duplicated response contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1210`.
- The response message indicates that the ISBN already exists in the user collection.
- The collection contains only one occurrence of the ISBN.
- No duplicate book entry is persisted.

---

### API-COL-005 — Reject adding an ISBN that is not available in the catalog

| Field | Description |
|---|---|
| Endpoint | `/BookStore/v1/Books` |
| Method | `POST` |
| Test type | Negative, business rule, integration and data consistency |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/books/add-book-to-collection.spec.ts` |

#### Preconditions

- The Book Store API is available.
- An authenticated test user has been created.
- The selected ISBN does not exist in the current catalog.
- The user collection is initially empty.

#### Test Data

| Field | Value |
|---|---|
| `userId` | UUID returned during user creation |
| `Authorization` | Valid Bearer token |
| `isbn` | Nonexistent ISBN defined in reusable test data |

#### Steps

1. Create and authenticate a unique test user.
2. Prepare an ISBN that is not available in the catalog.
3. Send a `POST` request to `/BookStore/v1/Books`.
4. Include the user UUID and nonexistent ISBN.
5. Include the valid Bearer token.
6. Read the response status, headers and body.
7. Retrieve the user collection.
8. Delete the test user during cleanup.

#### Expected Results

- The add-book response status is `400 Bad Request`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1205`.
- The response message is `ISBN supplied is not available in Books Collection!`.
- The user collection remains empty.
- No unavailable ISBN is persisted.

---

### API-COL-006 — Remove a book from the authenticated user collection

| Field | Description |
|---|---|
| Endpoint | `/BookStore/v1/Book` |
| Method | `DELETE` |
| Test type | Positive, functional, integration and data consistency |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/books/remove-book-from-collection.spec.ts` |

#### Preconditions

- The Book Store API is available.
- An authenticated test user has been created.
- An available book has been added to the user collection.
- The user collection contains the selected ISBN.

#### Test Data

| Field | Value |
|---|---|
| `userId` | UUID returned during user creation |
| `Authorization` | Valid Bearer token |
| `isbn` | ISBN previously added to the user collection |

#### Steps

1. Create and authenticate a unique test user.
2. Select an available book from the catalog.
3. Add the selected book to the user collection.
4. Confirm through the user-details endpoint that the collection contains the book.
5. Send a `DELETE` request to `/BookStore/v1/Book`.
6. Include the user UUID and ISBN in the request body.
7. Include the valid Bearer token.
8. Read the deletion response.
9. Retrieve the user collection again.
10. Delete the test user during cleanup.

#### Expected Results

- The deletion response status is `204 No Content`.
- The deletion response body is empty.
- The subsequent user-details request returns `200 OK`.
- The user collection is empty.
- The removed ISBN no longer exists in the collection.
- The removal is persisted by the API.

---

### API-COL-007 — Reject removing a book that is not in the user collection

| Field | Description |
|---|---|
| Endpoint | `/BookStore/v1/Book` |
| Method | `DELETE` |
| Test type | Negative, business rule, integration and data consistency |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/books/remove-book-from-collection.spec.ts` |

#### Preconditions

- The Book Store API is available.
- An authenticated test user has been created.
- The user collection is empty.
- The selected ISBN exists in the catalog but is not in the user collection.

#### Test Data

| Field | Value |
|---|---|
| `userId` | UUID returned during user creation |
| `Authorization` | Valid Bearer token |
| `isbn` | Available catalog ISBN not present in the collection |

#### Steps

1. Create and authenticate a unique test user.
2. Retrieve the catalog and select an available book.
3. Do not add the selected book to the user collection.
4. Send a `DELETE` request to `/BookStore/v1/Book`.
5. Include the user UUID and selected ISBN.
6. Include the valid Bearer token.
7. Read the response status, headers and body.
8. Retrieve the user collection.
9. Delete the test user during cleanup.

#### Expected Results

- The removal response status is `400 Bad Request`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1206`.
- The response message indicates that the ISBN is not present in the user's collection.
- The user collection remains empty.
- No unrelated collection data is modified.

---

### API-COL-008 — Reject removing a book without an authentication token

| Field | Description |
|---|---|
| Endpoint | `/BookStore/v1/Book` |
| Method | `DELETE` |
| Test type | Negative, authentication, integration and data consistency |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/books/remove-book-from-collection.spec.ts` |

#### Preconditions

- The Book Store API is available.
- A test user has been created and authenticated.
- A book has been added to the user collection.
- A valid token is available only for verification and cleanup.

#### Test Data

| Field | Value |
|---|---|
| `userId` | UUID returned during user creation |
| `Authorization` | Not provided in the removal request |
| `isbn` | ISBN already present in the user collection |

#### Steps

1. Create and authenticate a unique test user.
2. Add an available book to the user collection.
3. Send a `DELETE` request to `/BookStore/v1/Book`.
4. Include the user UUID and ISBN.
5. Do not include an authentication token.
6. Read the response status, headers and body.
7. Retrieve the collection using the valid token.
8. Delete the test user during cleanup.

#### Expected Results

- The removal response status is `401 Unauthorized`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1200`.
- The response message is `User not authorized!`.
- The collection still contains exactly one book.
- The selected ISBN remains in the collection.
- No unauthorized deletion occurs.

---

### API-COL-009 — Remove all books from the authenticated user collection

| Field | Description |
|---|---|
| Endpoint | `/BookStore/v1/Books` |
| Method | `DELETE` |
| Test type | Positive, functional, integration and data consistency |
| Priority | High |
| Automation | Implemented with Playwright |
| Test file | `tests/books/remove-all-books-from-collection.spec.ts` |

#### Preconditions

- The Book Store API is available.
- An authenticated test user has been created.
- The catalog contains at least two different books.
- Two different books have been added to the user collection.

#### Test Data

| Field | Value |
|---|---|
| Query parameter | `UserId` |
| `UserId` | UUID returned during user creation |
| `Authorization` | Valid Bearer token |
| Collection data | Two different available ISBN values |

#### Steps

1. Create and authenticate a unique test user.
2. Retrieve the book catalog.
3. Select two different available books.
4. Add both books to the user collection.
5. Retrieve the user details and confirm that two books are present.
6. Send a `DELETE` request to `/BookStore/v1/Books`.
7. Include the user UUID in the `UserId` query parameter.
8. Include the valid Bearer token.
9. Read the deletion response.
10. Retrieve the user collection again.
11. Delete the test user during cleanup.

#### Expected Results

- The initial collection contains exactly two books.
- The delete-all response status is `204 No Content`.
- The response body is empty.
- No response `Content-Type` is required for the empty response.
- The subsequent user-details request returns `200 OK`.
- The user collection is empty.
- Neither previously added ISBN remains in the collection.
- The removal of all books is persisted.

---

### API-COL-010 — Prevent one user from adding a book to another user collection

| Field | Description |
|---|---|
| Endpoint | `/BookStore/v1/Books` |
| Method | `POST` |
| Test type | Negative, authorization, object-level access control, integration and data consistency |
| Priority | Critical |
| Automation | Implemented with Playwright |
| Test file | `tests/books/add-book-to-collection.spec.ts` |

#### Preconditions

- The Book Store API is available.
- Two different test users have been created.
- Both users have valid authentication tokens.
- An available catalog book has been selected.
- Both user collections are initially empty.

#### Test Data

| Field | Value |
|---|---|
| Acting user | First generated test user |
| Target user | Second generated test user |
| `Authorization` | Valid Bearer token belonging to the acting user |
| `userId` in request body | UUID belonging to the target user |
| `isbn` | ISBN selected from the current catalog |

#### Steps

1. Create and authenticate the acting user.
2. Create and authenticate the target user.
3. Retrieve the catalog and select an available book.
4. Send a `POST` request to `/BookStore/v1/Books`.
5. Use the acting user's valid Bearer token.
6. Include the target user's UUID in the request body.
7. Include the selected ISBN.
8. Read the response status, headers and body.
9. Retrieve both user collections using their respective valid tokens.
10. Delete both test users during cleanup.

#### Expected Results

- The add-book response status is `401 Unauthorized`.
- The `Content-Type` header contains `application/json`.
- The response matches the standard API error contract.
- The response error code is `1200`.
- The response message is `User not authorized!`.
- The acting user's collection remains empty.
- The target user's collection remains empty.
- One authenticated user cannot modify another user's collection.

---

## 8. Test Case Coverage Status

| Area | Documented | Automated |
|---|---:|---:|
| User creation | 5 | 5 |
| User retrieval and deletion | 2 | 2 |
| Token generation | 5 | 5 |
| User authorization | 5 | 5 |
| Book catalog | 5 | 5 |
| User collection | 10 | 10 |
| Total | 32 | 32 |

---

## 9. Notes

- Test users must use dynamically generated usernames.
- Tests must not depend on users created by previous tests.
- Users and books created during a test must be removed whenever cleanup is possible.
- Valid passwords must be provided through environment variables.
- Authentication tokens must never be written to repository files or execution evidence.
- The test case `API-BKS-005` is currently skipped because of the behavior documented in `BUG-API-001`.
