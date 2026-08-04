# API Test Plan

## 1. Document information

| Field | Details |
|---|---|
| Project | QA Bookstore API Testing |
| Application under test | DemoQA Book Store API |
| Base URL | `https://bookstore.toolsqa.com` |
| Test level | API and integration testing |
| Document status | In progress |
| Repository language | English |

---

## 2. Purpose

This test plan defines the scope, approach, resources, environments, data,
entry criteria, exit criteria, risks, and deliverables for testing the DemoQA
Book Store API.

The project evaluates the API behavior at endpoint, contract, business-rule,
authentication, authorization, and integration levels.

The objective is not only to verify successful responses, but also to validate
negative scenarios, data persistence, access control, cleanup, and known API
limitations.

---

## 3. Application overview

The DemoQA Book Store API allows clients to:

- retrieve the available book catalog;
- retrieve a specific book by ISBN;
- create users;
- generate authentication tokens;
- verify user authorization;
- retrieve authenticated user data;
- add books to a user collection;
- remove one or all books from a collection;
- delete users.

The API uses REST endpoints, JSON request and response bodies, HTTP status
codes, and Bearer token authentication for protected operations.

---

## 4. Test objectives

The testing activities aim to verify that:

- endpoints return the expected HTTP status codes;
- responses use the expected content type;
- response bodies follow the expected structure;
- required fields contain valid values and data types;
- authentication succeeds only with valid credentials;
- protected resources reject missing or invalid tokens;
- users cannot manipulate another user's collection;
- business rules reject invalid, duplicated, or unavailable books;
- data created through one endpoint is available through related endpoints;
- book removal is persisted;
- test users and test data are removed after execution;
- failures are returned as controlled and understandable API responses;
- known defects are documented without blocking unrelated test coverage.

---

## 5. Scope

### 5.1 In scope

The following areas are included:

#### Book catalog

- retrieve the complete book list;
- retrieve a book using a valid ISBN;
- query an unavailable ISBN;
- query an empty ISBN;
- query the endpoint without the ISBN parameter;
- validate book response fields and data types;
- validate book JSON contracts.

#### Account management

- create a user with valid credentials;
- reject duplicated users;
- reject passwords that do not meet the defined requirements;
- reject empty username or password values;
- retrieve an authenticated user's details;
- delete an authenticated user;
- confirm that a deleted user is no longer available.

#### Authentication and authorization

- generate a token with valid credentials;
- reject invalid credentials;
- reject nonexistent users;
- reject empty authentication fields;
- verify authorization after token generation;
- reject access without a token;
- reject access with an invalid token;
- validate token response fields and structure.

#### Book collection management

- add an available book to a user collection;
- reject duplicated books;
- reject unavailable ISBN values;
- reject requests without authentication;
- reject requests with invalid authentication;
- prevent one user from modifying another user's collection;
- validate persistence through a subsequent GET request;
- remove a specific book;
- remove all books;
- confirm that removed books are no longer present.

#### Integration flows

- create user → generate token → retrieve user;
- create user → generate token → add book → retrieve collection;
- add book → remove book → confirm empty collection;
- complete cleanup after authenticated scenarios.

#### Contract validation

- required response properties;
- unexpected response properties;
- primitive data types;
- nested arrays and objects;
- ISBN values;
- numeric page values;
- date fields;
- website URL fields;
- standard API error structures.

---

### 5.2 Out of scope

The following items are not covered in the current project:

- graphical user interface testing;
- mobile application testing;
- database validation through direct SQL access;
- server-side logs and infrastructure monitoring;
- exhaustive penetration testing;
- load, stress, spike, or endurance testing;
- production environment validation;
- browser compatibility;
- third-party service integrations;
- recovery testing after infrastructure failures;
- source-code-level unit testing;
- administrative functionality not exposed by the public API.

Performance testing may be added in a later portfolio project using a dedicated
tool and controlled scope.

---

## 6. Test approach

The project uses a combination of automated and exploratory API testing.

### 6.1 Playwright API testing

Playwright with TypeScript is used for:

- automated functional tests;
- positive and negative scenarios;
- authentication and authorization checks;
- integration between related endpoints;
- reusable test-data generation;
- automated cleanup;
- JSON Schema validation;
- HTML execution reports.

### 6.2 Bruno API collection

Bruno is used for:

- manual and exploratory API execution;
- readable request collections;
- environment variables;
- runtime variables shared between requests;
- authenticated integration flows;
- command-line collection execution;
- independent validation outside Playwright.

### 6.3 Validation strategy

Each scenario may include, when applicable:

- HTTP status code;
- `Content-Type` header;
- exact business error message;
- response body structure;
- required properties;
- data types;
- field values;
- JSON Schema validation;
- authentication behavior;
- authorization behavior;
- persistence through a follow-up request;
- cleanup confirmation.

---

## 7. Test environments

### 7.1 QA environment

| Item | Value |
|---|---|
| Environment | Public QA API |
| Base URL | `https://bookstore.toolsqa.com` |
| Protocol | HTTPS |
| Request format | JSON |
| Response format | JSON |
| Authentication | Bearer token |
| Bruno environment | `bruno/environments/qa.bru` |
| Playwright configuration | `playwright.config.ts` |

The API is externally hosted and is not controlled by this project.

Temporary instability, response delays, certificate issues, and changes in test
data may affect execution.

---

## 8. Test data

Test data is designed to be reusable, isolated, and safe for a public testing
environment.

The project uses:

- dynamically generated usernames;
- a technical test password loaded from environment variables;
- known valid ISBN values from the public catalog;
- intentionally unavailable ISBN values;
- empty and invalid input values;
- runtime user IDs;
- runtime authentication tokens.

Sensitive values must not be committed to the repository or printed in public
execution evidence.

The local Bruno password is stored in:

```text
bruno/.env
```

This file is ignored by Git. The required variable is documented in:

```text
bruno/.env.example
```

---

## 9. Test independence and cleanup

Automated scenarios should not depend on data created by unrelated tests.

When authentication or collection data is required, the scenario should:

1. create its own user;
2. generate its own authentication token;
3. execute the intended validation;
4. remove created books when applicable;
5. delete the test user.

Cleanup should be attempted even when the main validation fails.

The Bruno collection uses an ordered integration flow because runtime variables
are intentionally shared between its requests.

---

## 10. Entry criteria

Testing can begin when:

- the API base URL is reachable;
- Node.js and npm are installed;
- project dependencies are installed;
- the Bruno test password is configured locally;
- the required valid ISBN is available in the catalog;
- Playwright and Bruno CLI commands are available;
- the working branch contains the intended test implementation.

---

## 11. Exit criteria

The planned testing phase can be considered complete when:

- all implemented tests have been executed;
- expected positive scenarios pass;
- expected negative scenarios pass;
- contract validations pass;
- authentication and authorization rules are covered;
- integration flows confirm data persistence;
- cleanup is confirmed;
- failures are investigated;
- reproducible defects are documented;
- known defects are linked to related test cases;
- execution results are recorded without exposing sensitive data;
- the repository can be installed and executed from documented commands.

A known defect may remain open when it is documented and does not prevent the
remaining test suite from running.

---

## 12. Suspension and resumption criteria

Testing may be suspended when:

- the API is unavailable;
- a dependency consistently returns infrastructure errors;
- authentication cannot be completed;
- test users cannot be cleaned up;
- response times prevent reliable execution;
- the public catalog no longer contains the configured valid ISBN;
- an API change invalidates multiple scenarios.

Testing may resume after:

- API availability is restored;
- the affected dependency becomes stable;
- test data is updated;
- the failure is identified as an expected product defect;
- automation is adjusted to an intentional API contract change.

---

## 13. Defect management

Defects are documented in:

```text
docs/bug-reports.md
```

Each report should contain:

- bug identifier;
- related test case;
- endpoint;
- severity;
- priority;
- status;
- environment;
- description;
- preconditions;
- reproduction steps;
- expected result;
- actual result;
- impact;
- evidence;
- workaround;
- suggested fix.

Known defects must not be hidden by weakening assertions.

When a defect would block the complete suite, the related scenario may be
marked as skipped or expected to fail, provided the reason and bug identifier
are clearly documented.

---

## 14. Deliverables

The project is expected to contain:

- API test plan;
- test strategy;
- documented test cases;
- automated Playwright tests;
- Bruno collection;
- JSON Schemas;
- reusable test data;
- bug reports;
- traceability matrix;
- risks and limitations;
- execution report;
- Playwright HTML report;
- GitHub Actions workflow;
- professional README.

---

## 15. Tools and technologies

| Tool or technology | Purpose |
|---|---|
| Playwright | API test automation |
| TypeScript | Test implementation and type safety |
| Node.js | Runtime environment |
| Bruno | Manual and exploratory API testing |
| Bruno CLI | Command-line collection execution |
| Ajv | JSON Schema validation |
| Git | Version control |
| GitHub | Repository and pull request management |
| GitHub Actions | Continuous integration |
| PowerShell | Local project commands |

---

## 16. Roles and responsibilities

This is an individual portfolio project.

The QA author is responsible for:

- defining the test scope;
- designing test scenarios;
- implementing automation;
- maintaining test data;
- executing tests;
- investigating failures;
- documenting defects;
- preserving sensitive information;
- reviewing pull requests;
- maintaining project documentation.

---

## 17. Risks and limitations

Key risks include:

- dependency on a public third-party API;
- API instability or temporary unavailability;
- response delays and timeouts;
- uncontrolled changes in the public catalog;
- lack of access to backend logs and databases;
- inability to verify server-side implementation details;
- security findings that cannot be corrected by the test project;
- transient vulnerabilities introduced by development-tool dependencies;
- possible leftover test data when external cleanup requests fail.

Detailed risks and mitigations will be maintained in:

```text
docs/risks-and-limitations.md
```

---

## 18. Assumptions

The test plan assumes that:

- the published API endpoints represent the intended application interface;
- valid test users may be created and deleted;
- the public catalog contains at least one stable ISBN;
- authentication tokens are required for protected endpoints;
- API error responses should be controlled and returned without excessive delay;
- tests must not rely on direct database or server access;
- execution evidence must not expose passwords, JWTs, or personal data.

---

## 19. Approval and revision

This document is maintained as part of the repository and may be revised when:

- new endpoints are added to the project;
- test coverage changes;
- API behavior changes;
- new defects are discovered;
- CI/CD execution is introduced;
- project risks or limitations change.