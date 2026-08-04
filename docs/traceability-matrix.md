# Requirements Traceability Matrix

## Document Information

| Field | Value |
|---|---|
| Project | QA Bookstore API Testing |
| Application | DemoQA Book Store API |
| Document type | Requirements Traceability Matrix |
| Test layer | API, integration and contract testing |
| Automation tools | Playwright API and Bruno |
| Status | In progress |

---

## 1. Purpose

This document connects the project requirements to their corresponding documented and automated test cases.

The matrix helps demonstrate:

- requirement coverage;
- traceability between documentation and automation;
- endpoint and business-rule validation;
- known defects and limitations;
- gaps that still require attention.

A test case is considered automated when it exists in the Playwright suite. The matrix does not claim a successful result unless supported by an actual test execution report.

---

## 2. Status Definitions

| Status | Meaning |
|---|---|
| Automated | The test case is implemented in the Playwright suite |
| Automated — known defect | The test exists but is marked with `test.fixme` because of a documented defect |
| Covered by Bruno | The flow is also represented in the Bruno collection |
| Not applicable | No defect is currently linked to the requirement |

---

## 3. Account Requirements

| Requirement ID | Requirement | Endpoint | Test Case | Automation File | Automation Status | Related Defect |
|---|---|---|---|---|---|---|
| REQ-ACC-001 | The API must create a user when valid credentials are provided | `POST /Account/v1/User` | `API-ACC-001` | `tests/account/create-user.spec.ts` | Automated; covered by Bruno | Not applicable |
| REQ-ACC-002 | The API must reject the creation of a duplicated user | `POST /Account/v1/User` | `API-ACC-002` | `tests/account/create-user.spec.ts` | Automated | Not applicable |
| REQ-ACC-003 | The API must reject passwords that do not meet the password policy | `POST /Account/v1/User` | `API-ACC-003` | `tests/account/create-user.spec.ts` | Automated | Not applicable |
| REQ-ACC-004 | The username field must be required during user creation | `POST /Account/v1/User` | `API-ACC-004` | `tests/account/create-user.spec.ts` | Automated | Not applicable |
| REQ-ACC-005 | The password field must be required during user creation | `POST /Account/v1/User` | `API-ACC-005` | `tests/account/create-user.spec.ts` | Automated | Not applicable |
| REQ-ACC-006 | An authenticated user must be deletable by UUID | `DELETE /Account/v1/User/{UUID}` | `API-ACC-006` | `tests/account/delete-user.spec.ts` | Automated; covered by Bruno | Not applicable |
| REQ-ACC-007 | The API must return the authenticated user details | `GET /Account/v1/User/{UUID}` | `API-ACC-007` | `tests/account/get-user.spec.ts` | Automated; covered by Bruno | Not applicable |

---

## 4. Token Generation Requirements

| Requirement ID | Requirement | Endpoint | Test Case | Automation File | Automation Status | Related Defect |
|---|---|---|---|---|---|---|
| REQ-TKN-001 | The API must generate a token for valid existing-user credentials | `POST /Account/v1/GenerateToken` | `API-AUTH-001` | `tests/account/generate-token.spec.ts` | Automated; covered by Bruno | Not applicable |
| REQ-TKN-002 | The API must not generate a token when the password is incorrect | `POST /Account/v1/GenerateToken` | `API-AUTH-002` | `tests/account/generate-token.spec.ts` | Automated | Not applicable |
| REQ-TKN-003 | The API must not generate a token for a nonexistent user | `POST /Account/v1/GenerateToken` | `API-AUTH-003` | `tests/account/generate-token.spec.ts` | Automated | Not applicable |
| REQ-TKN-004 | The username field must be required during token generation | `POST /Account/v1/GenerateToken` | `API-AUTH-004` | `tests/account/generate-token.spec.ts` | Automated | Not applicable |
| REQ-TKN-005 | The password field must be required during token generation | `POST /Account/v1/GenerateToken` | `API-AUTH-005` | `tests/account/generate-token.spec.ts` | Automated | Not applicable |

---

## 5. Authorization Requirements

| Requirement ID | Requirement | Endpoint | Test Case | Automation File | Automation Status | Related Defect |
|---|---|---|---|---|---|---|
| REQ-AUT-001 | A user must become authorized only after successful token generation | `POST /Account/v1/Authorized` | `API-AUTH-006` | `tests/account/authorized.spec.ts` | Automated | Not applicable |
| REQ-AUT-002 | The API must reject authorization when the password is incorrect | `POST /Account/v1/Authorized` | `API-AUTH-007` | `tests/account/authorized.spec.ts` | Automated | Not applicable |
| REQ-AUT-003 | The API must reject authorization for a nonexistent user | `POST /Account/v1/Authorized` | `API-AUTH-008` | `tests/account/authorized.spec.ts` | Automated | Not applicable |
| REQ-AUT-004 | The username field must be required during authorization | `POST /Account/v1/Authorized` | `API-AUTH-009` | `tests/account/authorized.spec.ts` | Automated | Not applicable |
| REQ-AUT-005 | The password field must be required during authorization | `POST /Account/v1/Authorized` | `API-AUTH-010` | `tests/account/authorized.spec.ts` | Automated | Not applicable |

---

## 6. Book Catalog Requirements

| Requirement ID | Requirement | Endpoint | Test Case | Automation File | Automation Status | Related Defect |
|---|---|---|---|---|---|---|
| REQ-BKS-001 | The API must return the available book catalog with valid book data | `GET /BookStore/v1/Books` | `API-BKS-001` | `tests/books/get-books.spec.ts` | Automated; covered by Bruno | Not applicable |
| REQ-BKS-002 | The API must return the requested book when the ISBN exists | `GET /BookStore/v1/Book` | `API-BKS-002` | `tests/books/get-book-by-isbn.spec.ts` | Automated; covered by Bruno | Not applicable |
| REQ-BKS-003 | The API must return an error for an unavailable ISBN | `GET /BookStore/v1/Book` | `API-BKS-003` | `tests/books/get-book-by-isbn.spec.ts` | Automated; covered by Bruno | Not applicable |
| REQ-BKS-004 | The API must reject an empty ISBN query value | `GET /BookStore/v1/Book` | `API-BKS-004` | `tests/books/get-book-by-isbn.spec.ts` | Automated | Not applicable |
| REQ-BKS-005 | The API must return a validation response when the ISBN parameter is omitted | `GET /BookStore/v1/Book` | `API-BKS-005` | `tests/books/get-book-by-isbn.spec.ts` | Automated — known defect (`test.fixme`) | `BUG-API-001` |

---

## 7. User Collection Requirements

| Requirement ID | Requirement | Endpoint | Test Case | Automation File | Automation Status | Related Defect |
|---|---|---|---|---|---|---|
| REQ-COL-001 | An authenticated user must be able to add an available book to their collection | `POST /BookStore/v1/Books` | `API-COL-001` | `tests/books/add-book-to-collection.spec.ts` | Automated; covered by Bruno | Not applicable |
| REQ-COL-002 | The API must reject adding a book without an authentication token | `POST /BookStore/v1/Books` | `API-COL-002` | `tests/books/add-book-to-collection.spec.ts` | Automated | Not applicable |
| REQ-COL-003 | The API must reject adding a book with an invalid token | `POST /BookStore/v1/Books` | `API-COL-003` | `tests/books/add-book-to-collection.spec.ts` | Automated | Not applicable |
| REQ-COL-004 | The API must reject adding the same book twice to one collection | `POST /BookStore/v1/Books` | `API-COL-004` | `tests/books/add-book-to-collection.spec.ts` | Automated | Not applicable |
| REQ-COL-005 | The API must reject adding an ISBN that is not available in the catalog | `POST /BookStore/v1/Books` | `API-COL-005` | `tests/books/add-book-to-collection.spec.ts` | Automated | Not applicable |
| REQ-COL-006 | An authenticated user must be able to remove a book from their collection | `DELETE /BookStore/v1/Book` | `API-COL-006` | `tests/books/remove-book-from-collection.spec.ts` | Automated; covered by Bruno | Not applicable |
| REQ-COL-007 | The API must reject removing a book that is not in the collection | `DELETE /BookStore/v1/Book` | `API-COL-007` | `tests/books/remove-book-from-collection.spec.ts` | Automated | Not applicable |
| REQ-COL-008 | The API must reject removing a book without an authentication token | `DELETE /BookStore/v1/Book` | `API-COL-008` | `tests/books/remove-book-from-collection.spec.ts` | Automated | Not applicable |
| REQ-COL-009 | An authenticated user must be able to remove all books from their collection | `DELETE /BookStore/v1/Books` | `API-COL-009` | `tests/books/remove-all-books-from-collection.spec.ts` | Automated | Not applicable |
| REQ-COL-010 | One authenticated user must not be able to modify another user's collection | `POST /BookStore/v1/Books` | `API-COL-010` | `tests/books/add-book-to-collection.spec.ts` | Automated | Not applicable |

---

## 8. Security and Operational Requirements

| Requirement ID | Requirement | Verification | Status | Related Defect or Risk |
|---|---|---|---|---|
| REQ-SEC-001 | Valid test passwords must not be hardcoded in tracked source files | `.env`, `.env.example`, `test-data/users-data.ts`, `utils/environment.ts` | Implemented | Historical credential exposure was remediated in the current branch history |
| REQ-SEC-002 | Authentication tokens must not be stored in repository files or execution evidence | Source and staged-file security checks | Implemented | `BUG-API-002` documents that the external API token payload exposes the password |
| REQ-SEC-003 | Test users must use unique usernames to avoid test collisions | `generateUniqueUsername()` in `test-data/users-data.ts` | Implemented | Not applicable |
| REQ-SEC-004 | Tests must clean up created users whenever cleanup is possible | Account and collection test teardown flows | Implemented | Cleanup can still depend on external API availability |
| REQ-OPS-001 | The suite must support local Playwright execution | `npm test` | Implemented | Requires a valid local `.env` |
| REQ-OPS-002 | The project must provide static TypeScript validation | `npm run typecheck` | Implemented | Not applicable |
| REQ-OPS-003 | The Bruno collection must support command-line execution | `npm run test:bruno` | Implemented | Requires `bruno/.env` |
| REQ-OPS-004 | The project must generate an HTML Playwright report | `playwright-report/` | Implemented | Report is generated during execution and is not committed by default |

---

## 9. Coverage Summary

| Area | Requirements | Documented Test Cases | Automated Test Cases | Known Defects |
|---|---:|---:|---:|---:|
| Account | 7 | 7 | 7 | 0 |
| Token generation | 5 | 5 | 5 | 0 |
| Authorization | 5 | 5 | 5 | 0 |
| Book catalog | 5 | 5 | 5 | 1 |
| User collection | 10 | 10 | 10 | 0 |
| Total functional coverage | 32 | 32 | 32 | 1 |

The functional traceability coverage is `32/32`.

One automated scenario, `API-BKS-005`, is marked with `test.fixme` because of `BUG-API-001`. Therefore, complete implementation coverage does not mean that all 32 scenarios currently produce passing execution results.

---

## 10. Defect Traceability

| Defect ID | Description | Related Requirement | Related Test Case | Current Test Treatment |
|---|---|---|---|---|
| `BUG-API-001` | The single-book endpoint does not complete the request when the ISBN parameter is omitted | `REQ-BKS-005` | `API-BKS-005` | Automated test marked with `test.fixme` |
| `BUG-API-002` | The generated JWT payload exposes the user's password in plaintext | `REQ-SEC-002` | Security inspection outside the functional 32-case suite | Documented security defect; tokens must not be logged or committed |

---

## 11. Notes and Limitations

- The requirements in this matrix were derived from the observed behavior and business rules exercised by the automated suite.
- The DemoQA Book Store API is an external dependency and may present instability, delays or behavior changes outside this repository.
- The matrix records implementation coverage, not a permanent guarantee that every test will pass in every execution.
- Execution results must be documented separately in the test execution report.
- The Bruno collection covers a representative end-to-end API flow and does not duplicate every negative Playwright scenario.
- Performance, load and reliability requirements are outside the current functional test scope.
