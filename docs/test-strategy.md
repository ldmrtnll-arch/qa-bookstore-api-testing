# API Test Strategy

## 1. Document information

| Field | Details |
|---|---|
| Project | QA Bookstore API Testing |
| Application under test | DemoQA Book Store API |
| Test level | API and integration testing |
| Automation tools | Playwright and Bruno |
| Implementation language | TypeScript |
| Document status | In progress |
| Repository language | English |

---

## 2. Purpose

This document describes the testing strategy adopted for the DemoQA Book Store
API.

The strategy explains how test coverage is selected, how risks are prioritized,
how automated tests are structured, how test data is managed, and how failures,
contracts, authentication, integration, and cleanup are validated.

The project prioritizes meaningful API validation over a large number of
superficial tests.

---

## 3. Quality objectives

The main quality objectives are to verify:

- functional correctness;
- response contract consistency;
- authentication behavior;
- authorization rules;
- business-rule enforcement;
- persistence between related endpoints;
- controlled handling of invalid requests;
- isolation between users;
- reliable cleanup of test data;
- reproducible local execution;
- clear reporting of failures and defects;
- protection of credentials and tokens.

---

## 4. Testing principles

The project follows these principles:

### 4.1 Validate behavior, not only status codes

A successful HTTP status code is not sufficient to confirm correct behavior.

Tests should also validate, when applicable:

- response headers;
- required response properties;
- exact business values;
- data types;
- nested structures;
- persistence;
- authorization;
- error messages;
- cleanup results.

### 4.2 Prefer deterministic tests

Tests should use controlled input data and explicit expected results.

Assertions should not accept any value merely because it exists. When a
specific value is expected, the test should compare against that value.

### 4.3 Keep tests independent

Playwright scenarios should create and remove their own test data.

One automated test should not depend on another test having executed first.

### 4.4 Test positive and negative behavior

Coverage should include:

- successful requests;
- invalid credentials;
- missing authentication;
- invalid authentication;
- empty fields;
- duplicated data;
- nonexistent resources;
- unavailable ISBN values;
- unauthorized cross-user operations;
- missing required parameters.

### 4.5 Preserve known defects

Assertions should not be weakened to make a defective response pass.

Known defects should be documented and linked to their related scenarios.

### 4.6 Protect sensitive information

Passwords, JWTs, usernames, and user identifiers must not be exposed in public
logs, screenshots, commits, or documentation.

---

## 5. Test levels

### 5.1 Endpoint testing

Individual endpoints are tested to verify:

- request acceptance;
- HTTP status code;
- content type;
- response body;
- required fields;
- expected error behavior.

Examples include:

- retrieving the book catalog;
- retrieving one book by ISBN;
- creating a user;
- generating a token.

### 5.2 Integration testing

Related endpoints are combined to verify complete workflows.

Examples include:

- create user → generate token → retrieve user;
- create user → generate token → add book;
- add book → retrieve user collection;
- remove book → retrieve collection again;
- delete user → confirm that the user no longer exists.

### 5.3 Contract testing

JSON Schema validation is used to verify that responses follow the expected
structure.

Contract testing covers:

- required properties;
- additional properties;
- data types;
- nested arrays;
- nested objects;
- error response structures;
- book structures;
- account structures.

### 5.4 Security-focused functional testing

The project includes functional security checks related to:

- valid authentication;
- invalid authentication;
- missing authentication;
- authorization between different users;
- sensitive information exposure;
- token handling.

This project does not perform exhaustive penetration testing.

---

## 6. Risk-based prioritization

Test scenarios are prioritized according to business and technical risk.

### High priority

- account creation;
- token generation;
- password handling;
- protected endpoint authorization;
- prevention of cross-user collection modification;
- test-user cleanup;
- exposure of credentials in authentication tokens.

### Medium priority

- adding books;
- removing books;
- retrieving user collections;
- duplicated-book validation;
- unavailable ISBN validation;
- required-parameter validation;
- contract validation.

### Lower priority

- informational catalog fields that do not affect authentication or collection
  management;
- cosmetic inconsistencies in error messages;
- fields that do not influence the tested business flow.

Priority may change when a failure blocks multiple dependent scenarios.

---

## 7. Test design techniques

The following techniques are used.

### 7.1 Equivalence partitioning

Input values are divided into meaningful groups.

Examples:

- valid username;
- empty username;
- nonexistent username;
- valid password;
- invalid password;
- empty password;
- valid ISBN;
- unavailable ISBN;
- empty ISBN.

### 7.2 Boundary and edge-case testing

Scenarios include boundaries around required fields and missing input.

Examples:

- empty authentication fields;
- missing ISBN parameter;
- empty ISBN value;
- password that does not meet requirements;
- collection after removing its only book.

### 7.3 Decision-based testing

Different combinations of authentication and resource ownership are tested.

Examples:

| Authentication | User ownership | Expected behavior |
|---|---|---|
| Valid token | Own collection | Operation allowed |
| Missing token | Own collection | Operation rejected |
| Invalid token | Own collection | Operation rejected |
| Valid token | Another user's collection | Operation rejected |

### 7.4 State-transition testing

The API behavior is validated across changes in resource state.

Examples:

```text
User does not exist
→ user created
→ token generated
→ user authenticated
→ user deleted
→ user unavailable
```

```text
Collection empty
→ book added
→ book persisted
→ book removed
→ collection empty
```

### 7.5 Error guessing

Additional scenarios are selected based on common API risks.

Examples:

- duplicated user;
- duplicated book;
- invalid token;
- missing token;
- unavailable resource;
- malformed or missing required data.

---

## 8. Automation strategy

Playwright API testing is the primary automated regression layer.

Bruno complements Playwright by providing:

- readable request collections;
- exploratory execution;
- manual inspection;
- runtime variable sharing;
- command-line collection execution;
- an independent way to validate the same integration flow.

The two tools are not intended to duplicate every scenario.

Playwright contains broader regression coverage, while Bruno represents a
smaller executable workflow focused on catalog, authentication, persistence,
and cleanup.

---

## 9. Playwright automation architecture

The Playwright suite separates responsibilities into dedicated folders.

```text
tests/
test-data/
types/
schemas/
utils/
```

### Tests

The `tests` directory contains scenarios grouped by API domain.

Examples:

```text
tests/account/
tests/books/
```

### Test data

The `test-data` directory contains reusable static and generated input values.

### Types

The `types` directory contains TypeScript interfaces representing API data.

### Schemas

The `schemas` directory contains JSON Schemas used for contract validation.

### Utilities

The `utils` directory contains reusable support functions, including schema
validation and test-data helpers.

This separation reduces duplication and keeps assertions focused on test
behavior.

---

## 10. Playwright test independence

Playwright scenarios should remain independent.

Authenticated tests should create their own resources whenever practical.

A typical scenario follows this lifecycle:

```text
Generate test credentials
→ create user
→ generate token
→ execute validation
→ remove created data
→ delete user
```

Cleanup should be placed in a structure that still attempts execution when the
main test assertion fails.

Tests must not rely on their execution order.

---

## 11. Bruno collection strategy

The Bruno collection represents an intentionally ordered integration flow.

The folder order is:

```text
1. account
2. books
3. cleanup
```

The flow is:

```text
Create User
→ Generate Token
→ Get Books
→ Get Book by ISBN
→ Validate unavailable ISBN
→ Add Book to Collection
→ Get User Collection
→ Remove Book from Collection
→ Confirm Empty Collection
→ Delete User
→ Confirm Deleted User
```

Unlike the Playwright tests, these Bruno requests intentionally share runtime
variables.

Shared runtime values include:

- generated username;
- user ID;
- authentication token.

The collection should be executed sequentially.

---

## 12. Contract validation strategy

JSON Schema validation is used in the Playwright suite.

A contract validation should verify:

- required fields;
- allowed fields;
- primitive types;
- array structures;
- nested object structures;
- known error response formats.

Contract validation is combined with semantic assertions.

A response may satisfy a JSON Schema while still containing an incorrect
business value. Therefore, tests should also validate values such as:

- requested ISBN;
- created username;
- generated user ID;
- expected error code;
- expected error message;
- empty or populated collection state.

---

## 13. HTTP validation strategy

Each request should validate the most relevant parts of the HTTP response.

### Status code

The exact expected status should be asserted.

Examples:

- `200 OK`;
- `201 Created`;
- `204 No Content`;
- `400 Bad Request`;
- `401 Unauthorized`.

### Headers

JSON responses should validate that `Content-Type` contains:

```text
application/json
```

Responses with `204 No Content` should not be treated as JSON responses.

### Body

The response body should be validated according to the endpoint behavior.

For successful empty responses, the body should be empty.

For errors, the response should contain a controlled code and message when the
API contract provides them.

---

## 14. Authentication strategy

Authentication scenarios validate:

- successful token generation;
- incorrect password;
- nonexistent user;
- empty username;
- empty password;
- authorization after token generation.

The generated token should:

- exist;
- contain the expected JWT structure;
- include a valid expiration value;
- not be printed in logs.

The project also documents the security defect in which the generated JWT
contains the user's password in its payload.

---

## 15. Authorization strategy

Protected endpoints are tested with:

- valid token;
- missing token;
- invalid token;
- valid token associated with another user.

Authorization testing confirms that authentication alone is not sufficient to
modify resources belonging to another account.

The cross-user collection scenario is considered a high-value test because it
validates resource ownership.

---

## 16. Business-rule validation

Business rules include:

- usernames must be unique;
- passwords must meet API requirements;
- tokens require valid credentials;
- only catalog ISBN values may be added;
- the same book should not be added twice;
- a book must exist in the user's collection before removal;
- users must not modify another user's collection;
- deleted users must no longer be retrievable.

Business rules should be validated using both response values and follow-up
requests when persistence is involved.

---

## 17. Persistence validation

A successful mutation response does not prove that data was stored correctly.

Persistence is validated through subsequent GET requests.

Examples:

```text
POST book to collection
→ GET user collection
→ verify requested ISBN
```

```text
DELETE book from collection
→ GET user collection
→ verify empty collection
```

```text
DELETE user
→ GET deleted user
→ verify user is unavailable
```

This strategy provides stronger evidence than validating only the mutation
status code.

---

## 18. Test data strategy

Test data should be:

- isolated;
- reusable;
- understandable;
- safe for a public environment;
- removed after execution.

Dynamic usernames reduce collisions between parallel or repeated executions.

Known ISBN values are stored centrally so they can be updated when the public
catalog changes.

Unavailable ISBN values are intentionally selected to validate negative
behavior.

Passwords must be loaded from protected environment variables when used by the
Bruno collection.

---

## 19. Cleanup strategy

Cleanup protects the public environment from accumulated test data.

Playwright scenarios should attempt to delete users created by the scenario.

The Bruno collection contains a dedicated cleanup folder that executes after
the book workflow.

Cleanup validation includes:

- successful user deletion;
- empty response for `204 No Content`;
- follow-up request confirming that the deleted user is unavailable.

A cleanup failure should be investigated separately from the main test result.

---

## 20. Assertion strategy

Assertions should be specific and meaningful.

Preferred assertions include:

- exact status code;
- exact error message;
- expected field value;
- expected array length;
- requested ISBN equality;
- created user equality;
- empty response body;
- empty collection after removal;
- absence of a removed ISBN;
- complete expected object structure.

Assertions such as comparing a field with itself should not be used because
they do not validate behavior.

---

## 21. Failure analysis

When a test fails, the investigation should consider:

1. complete error message;
2. failed endpoint;
3. request data;
4. response status;
5. response headers;
6. response body;
7. API availability;
8. test-data collision;
9. authentication state;
10. cleanup result;
11. possible API contract change;
12. known defects.

A failure should not immediately be classified as an automation defect or an
application defect without investigation.

---

## 22. Defect strategy

Reproducible application defects are documented in:

```text
docs/bug-reports.md
```

Current documented defects include:

- `BUG-API-001`: the book endpoint does not respond when the ISBN parameter is
  omitted;
- `BUG-API-002`: the generated JWT exposes the user's password in its payload.

The related scenario for `BUG-API-001` is marked with `test.fixme` so the
known timeout does not block unrelated regression tests.

The defect remains visible in the test suite and documentation.

---

## 23. Reporting and evidence

Playwright generates an HTML execution report.

Bruno CLI provides a terminal summary containing:

- request count;
- passed requests;
- test count;
- assertion count;
- execution duration;
- process exit code.

Evidence must be reviewed before publication to ensure that it does not contain:

- passwords;
- complete JWTs;
- generated usernames;
- user IDs;
- personal information.

Execution results must only be documented after the commands are actually run.

---

## 24. Continuous integration strategy

The planned GitHub Actions workflow should execute:

```text
npm ci
→ npm run typecheck
→ npm test
```

The Playwright HTML report should be uploaded as a workflow artifact.

The Bruno integration collection requires a test password and creates data in a
public external API. Its use in CI must be evaluated carefully before being
enabled.

CI execution should not expose secrets in logs.

A failed quality check should cause the workflow to fail.

---

## 25. Dependency risk management

Development dependencies are reviewed with:

```text
npm audit
```

High-severity findings introduced by transitive Bruno CLI dependencies were
mitigated using controlled npm overrides for:

- Axios;
- form-data.

A moderate finding remains in the transitive `uuid` dependency used by the
Bruno CLI.

The current dependency tree reports no compatible automatic fix.

This known limitation must be documented rather than hidden or corrected using
an untested forced downgrade.

---

## 26. Maintenance strategy

The test suite should be reviewed when:

- endpoint behavior changes;
- response contracts change;
- the public catalog changes;
- authentication rules change;
- dependency versions change;
- new defects are identified;
- unstable scenarios appear;
- CI/CD is introduced.

Maintenance should preserve test intent and avoid weakening assertions merely
to restore a passing result.

---

## 27. Completion criteria

The strategy is considered implemented when:

- positive and negative scenarios are covered;
- critical authentication and authorization flows are tested;
- contract validation is applied;
- persistence is verified;
- test data is isolated;
- cleanup is confirmed;
- known defects are documented;
- local execution is reproducible;
- reports are generated;
- CI quality checks are configured;
- documentation reflects the implemented behavior.
