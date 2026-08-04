<div align="center">

# QA Bookstore API Testing

[![API Tests](https://github.com/ldmrtnll-arch/qa-bookstore-api-testing/actions/workflows/api-tests.yml/badge.svg)](https://github.com/ldmrtnll-arch/qa-bookstore-api-testing/actions/workflows/api-tests.yml)

API testing portfolio project built with **Playwright**, **TypeScript** and **Bruno**.

The project validates account management, authentication, authorization, book catalog operations and user collection workflows in the DemoQA Book Store API.

</div>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Application Under Test](#application-under-test)
- [Project Goals](#project-goals)
- [Technologies](#technologies)
- [Types of Testing](#types-of-testing)
- [Test Coverage](#test-coverage)
- [Test Design](#test-design)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Tests](#running-the-tests)
- [Reports and Evidence](#reports-and-evidence)
- [Continuous Integration](#continuous-integration)
- [Project Documentation](#project-documentation)
- [Known Defects](#known-defects)
- [Security Practices](#security-practices)
- [Key QA Decisions](#key-qa-decisions)
- [Latest Recorded Execution](#latest-recorded-execution)
- [Main Learnings](#main-learnings)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

---

## Project Overview

This repository is a complete API testing portfolio project created to demonstrate practical knowledge expected from a Junior QA, Junior Test Analyst or Junior QA Automation Engineer.

The project goes beyond isolated endpoint checks. It includes:

- test planning;
- test strategy;
- documented test cases;
- positive and negative scenarios;
- contract validation;
- authentication and authorization checks;
- integration between account and bookstore endpoints;
- reusable test data;
- test cleanup;
- defect documentation;
- requirements traceability;
- risks and limitations;
- command-line API execution with Bruno;
- automated regression testing with Playwright;
- continuous integration with GitHub Actions.

The main goal is to show how QA decisions, documentation and automation can work together in a realistic API testing project.

---

## Application Under Test

The project tests the public **DemoQA Book Store API**.

Base URL:

```text
https://bookstore.toolsqa.com
```

Main API areas:

| Area | Main Endpoints |
|---|---|
| Account creation | `POST /Account/v1/User` |
| Token generation | `POST /Account/v1/GenerateToken` |
| Authorization | `POST /Account/v1/Authorized` |
| User details | `GET /Account/v1/User/{UUID}` |
| User deletion | `DELETE /Account/v1/User/{UUID}` |
| Book catalog | `GET /BookStore/v1/Books` |
| Book by ISBN | `GET /BookStore/v1/Book` |
| Add books | `POST /BookStore/v1/Books` |
| Remove one book | `DELETE /BookStore/v1/Book` |
| Remove all books | `DELETE /BookStore/v1/Books` |

The application is an external public API. This repository does not control its source code, infrastructure, database or production behavior.

---

## Project Goals

The project was designed to demonstrate:

- API test planning and documentation;
- HTTP status code validation;
- response header validation;
- response body validation;
- JSON contract validation;
- positive, negative and alternative scenarios;
- authentication and authorization testing;
- account lifecycle testing;
- integration between API resources;
- business rule validation;
- data persistence verification through API responses;
- reusable test data;
- isolated and independent tests;
- cleanup of generated users and collections;
- defect reporting;
- requirements traceability;
- secure test credential handling;
- local and CI execution.

---

## Technologies

| Technology | Purpose |
|---|---|
| Playwright | API test automation |
| TypeScript | Test implementation with static typing |
| Node.js | Runtime environment |
| Bruno | Portable API collection and CLI execution |
| JSON Schema | Response contract validation |
| Git | Version control |
| GitHub | Repository, Pull Requests and project publication |
| GitHub Actions | Continuous integration |
| PowerShell | Local command execution on Windows |

---

## Types of Testing

The project includes:

- functional API testing;
- positive testing;
- negative testing;
- required-field validation;
- authentication testing;
- authorization testing;
- object-level access control validation;
- contract testing;
- integration testing;
- business rule testing;
- data consistency validation;
- regression testing;
- basic security-oriented validation;
- cleanup and lifecycle validation.

Performance testing is intentionally outside this project and is planned for a separate portfolio project using k6.

---

## Test Coverage

The Playwright suite contains **32 automated API test cases**.

| Area | Test Cases | Automated |
|---|---:|---:|
| User creation | 5 | 5 |
| User retrieval and deletion | 2 | 2 |
| Token generation | 5 | 5 |
| User authorization | 5 | 5 |
| Book catalog | 5 | 5 |
| User collection | 10 | 10 |
| **Total** | **32** | **32** |

### Test case groups

| Prefix | Area |
|---|---|
| `API-ACC-*` | Account creation, retrieval and deletion |
| `API-AUTH-*` | Token generation and user authorization |
| `API-BKS-*` | Book catalog and ISBN validation |
| `API-COL-*` | User collection operations |

### Current execution treatment

- 31 tests currently pass in the recorded local regression;
- 1 test is marked with `test.fixme`;
- the skipped test is linked to the known defect `BUG-API-001`;
- skipped tests are not reported as passed.

---

## Test Design

### Independent tests

Each scenario creates its own data whenever necessary.

Tests do not depend on users or books created by previous tests.

### Unique test users

Usernames are generated dynamically to reduce collisions during parallel and repeated execution.

### Reusable test data

Reusable data is separated from test logic under:

```text
test-data/
```

### Reusable contracts

Response contracts are separated under:

```text
schemas/
```

### Cleanup

Created users and collection data are removed whenever cleanup is possible.

Cleanup is important because the application under test is a shared public environment.

### Relevant assertions

The suite validates more than status codes.

Depending on the scenario, assertions include:

- `Content-Type`;
- error codes and messages;
- UUID format;
- username consistency;
- JWT structure;
- token expiration;
- JSON Schema contracts;
- required book fields;
- valid page count;
- valid publication date;
- valid website URL;
- duplicate ISBN detection;
- collection persistence;
- collection cleanup;
- cross-user authorization protection.

---

## Repository Structure

```text
qa-bookstore-api-testing/
│
├── .github/
│   └── workflows/
│       └── api-tests.yml
│
├── bruno/
│   ├── account/
│   ├── books/
│   ├── cleanup/
│   ├── environments/
│   ├── .env.example
│   └── bruno.json
│
├── docs/
│   ├── bug-reports.md
│   ├── risks-and-limitations.md
│   ├── test-cases.md
│   ├── test-execution-report.md
│   ├── test-plan.md
│   ├── test-strategy.md
│   └── traceability-matrix.md
│
├── schemas/
│   ├── add-books-response-schema.ts
│   ├── api-error-schema.ts
│   ├── authorized-response-schema.ts
│   ├── book-schema.ts
│   ├── books-response-schema.ts
│   ├── created-user-schema.ts
│   ├── generate-token-response-schema.ts
│   └── user-details-schema.ts
│
├── test-data/
│   ├── auth-data.ts
│   ├── books-data.ts
│   ├── collection-data.ts
│   └── users-data.ts
│
├── tests/
│   ├── account/
│   │   ├── authorized.spec.ts
│   │   ├── create-user.spec.ts
│   │   ├── delete-user.spec.ts
│   │   ├── generate-token.spec.ts
│   │   └── get-user.spec.ts
│   │
│   └── books/
│       ├── add-book-to-collection.spec.ts
│       ├── get-book-by-isbn.spec.ts
│       ├── get-books.spec.ts
│       ├── remove-all-books-from-collection.spec.ts
│       └── remove-book-from-collection.spec.ts
│
├── types/
│   ├── api-error.ts
│   └── book.ts
│
├── utils/
│   ├── account-api.ts
│   ├── environment.ts
│   └── schema-validator.ts
│
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

The exact file list may evolve as the project receives improvements.

---

## Prerequisites

Install the following tools:

- Git;
- Node.js 24;
- npm;
- Bruno, only when running the collection through the desktop application.

The Bruno CLI is installed through the project dependencies and is executed with an npm script.

Check your versions:

```powershell
git --version
node --version
npm --version
```

---

## Installation

Clone the repository:

```powershell
git clone https://github.com/ldmrtnll-arch/qa-bookstore-api-testing.git
```

Enter the project folder:

```powershell
cd qa-bookstore-api-testing
```

Install the dependencies:

```powershell
npm ci
```

Because this is an API-only Playwright project, browser installation is not required for the current tests.

---

## Environment Configuration

### Playwright

Copy the root environment example:

```powershell
Copy-Item .env.example .env
```

Open the file:

```powershell
notepad .env
```

Provide a valid test-only password:

```text
BOOKSTORE_TEST_PASSWORD=replace-with-a-valid-test-password
```

The password must comply with the DemoQA password policy.

Use a dedicated test password that:

- has at least eight characters;
- contains an uppercase letter;
- contains a lowercase letter;
- contains a number;
- contains a special character;
- is not reused in personal or professional accounts.

### Bruno

Copy the Bruno environment example:

```powershell
Copy-Item .\bruno\.env.example .\bruno\.env
```

Open:

```powershell
notepad .\bruno\.env
```

Provide the required Bruno test value according to the example file.

### Security

The following files are ignored by Git:

```text
.env
bruno/.env
```

Never commit:

- passwords;
- Bearer tokens;
- complete JWT values;
- personal credentials;
- production secrets.

---

## Running the Tests

### TypeScript validation

```powershell
npm run typecheck
```

Expected result:

```text
No TypeScript compilation errors.
```

### Complete Playwright suite

```powershell
npm test
```

### Only book-related tests

```powershell
npm run test:books
```

### Specific Playwright file

```powershell
npx playwright test tests/account/create-user.spec.ts
```

### Specific test case

```powershell
npx playwright test --grep "API-ACC-001"
```

### Bruno CLI collection

```powershell
npm run test:bruno
```

The Bruno command runs the ordered account and book collection flow from the `bruno/` directory.

---

## Reports and Evidence

### Playwright HTML report

The Playwright configuration generates an HTML report in:

```text
playwright-report/
```

Open the latest local report:

```powershell
npx playwright show-report
```

### Execution artifacts

Playwright may also generate:

```text
test-results/
```

Generated reports and execution artifacts are ignored by Git by default.

### GitHub Actions artifacts

The CI workflow uploads the Playwright report after each execution, including failed runs.

Artifact retention:

```text
14 days
```

Evidence must not contain:

- passwords;
- JWT values;
- authorization headers;
- reusable credentials.

---

## Continuous Integration

The project includes:

```text
.github/workflows/api-tests.yml
```

The workflow runs on:

- pushes to `main`;
- Pull Requests targeting `main`;
- manual execution through `workflow_dispatch`.

### CI steps

1. Check out the repository.
2. Configure Node.js 24.
3. Install dependencies with `npm ci`.
4. Run TypeScript validation.
5. Run Playwright API tests.
6. Upload Playwright reports and execution artifacts.

### CI secret

The repository requires this GitHub Actions secret:

```text
BOOKSTORE_TEST_PASSWORD
```

The secret is provided to the workflow through:

```yaml
env:
  BOOKSTORE_TEST_PASSWORD: ${{ secrets.BOOKSTORE_TEST_PASSWORD }}
```

The real value is not stored in the repository.

---

## Project Documentation

| Document | Description |
|---|---|
| [Test Plan](docs/test-plan.md) | Scope, objectives, resources, entry criteria and exit criteria |
| [Test Strategy](docs/test-strategy.md) | Testing approach, techniques, architecture and quality decisions |
| [Test Cases](docs/test-cases.md) | 32 documented test cases with preconditions, steps, data and expected results |
| [Bug Reports](docs/bug-reports.md) | Reproducible defects found during testing |
| [Traceability Matrix](docs/traceability-matrix.md) | Requirements mapped to test cases, automation files and defects |
| [Risks and Limitations](docs/risks-and-limitations.md) | Technical risks, security risks, mitigations and project limitations |
| [Test Execution Report](docs/test-execution-report.md) | Recorded local regression results and interpretation |

---

## Known Defects

### BUG-API-001 — Missing ISBN leaves the request pending

Endpoint:

```text
GET /BookStore/v1/Book
```

When the `ISBN` query parameter is omitted, the endpoint does not complete the request within the expected time.

Related test:

```text
API-BKS-005
```

Current treatment:

```text
test.fixme
```

The scenario remains documented and automated, but it is not reported as passed.

### BUG-API-002 — JWT payload exposes the password

The token generated by the external API contains the user's password in plaintext inside the JWT payload.

Impact:

- token leakage may also expose the credential;
- JWT values must not be logged, committed or attached as evidence.

The defect belongs to the external API and cannot be fixed in this repository.

---

## Security Practices

The project applies the following practices:

- valid passwords are loaded from environment variables;
- `.env` files are ignored;
- `.env.example` contains placeholders only;
- authentication tokens are not stored;
- test usernames are generated dynamically;
- secrets are configured through GitHub Actions;
- staged files are checked before commits;
- test credentials are separated from source code;
- tokens are not printed as evidence;
- security defects are documented transparently.

---

## Key QA Decisions

### Why Playwright for API testing?

Playwright provides:

- an integrated request context;
- fast API-only execution;
- TypeScript support;
- powerful assertions;
- parallel execution;
- HTML reports;
- a simple path to CI.

### Why Bruno?

Bruno demonstrates:

- a portable API collection;
- a readable request sequence;
- command-line execution;
- environment-based variables;
- a recruiter-friendly alternative to Postman;
- representative end-to-end API validation.

### Why not automate only happy paths?

A strong QA portfolio must show failure analysis and business-rule validation.

This project includes:

- duplicate users;
- weak passwords;
- missing required values;
- incorrect credentials;
- nonexistent users;
- invalid tokens;
- missing tokens;
- unavailable ISBN values;
- duplicate books;
- removing missing books;
- cross-user collection modification attempts.

### Why not duplicate every Playwright test in Bruno?

Playwright is the primary regression suite.

Bruno represents a realistic API collection flow without creating unnecessary duplication and maintenance.

---

## Latest Recorded Execution

The latest documented local execution was performed on **2026-08-04**.

### TypeScript

| Metric | Result |
|---|---:|
| Compilation errors | 0 |
| Result | Passed |

### Playwright

| Metric | Result |
|---|---:|
| Total tests | 32 |
| Passed | 31 |
| Skipped | 1 |
| Failed | 0 |
| Result | Passed with one known skipped scenario |

### Bruno

| Metric | Result |
|---|---:|
| Requests | 11/11 passed |
| Tests | 20/20 passed |
| Assertions | 54/54 passed |
| Result | Passed |

See the complete record in:

[docs/test-execution-report.md](docs/test-execution-report.md)

---

## Main Learnings

This project reinforced the importance of:

- validating more than HTTP status codes;
- checking headers, contracts and business rules;
- separating test logic from data and schemas;
- creating independent tests;
- cleaning up generated data;
- investigating inconsistent external API behavior;
- distinguishing skipped tests from passing tests;
- documenting defects with reproducible evidence;
- connecting requirements to automation;
- protecting secrets from source control;
- validating the suite after security changes;
- using Pull Requests and CI checks before merging.

---

## Known Limitations

- The application under test is an external public API.
- The project has no access to backend logs.
- The project has no database access.
- The project cannot control service availability.
- The project cannot fix product defects.
- Contract expectations may require maintenance after external API changes.
- Performance testing is not included.
- Service virtualization is not included.
- The Bruno collection is representative rather than exhaustive.
- The recorded execution represents one specific date and environment.

See the detailed analysis in:

[docs/risks-and-limitations.md](docs/risks-and-limitations.md)

---

## Future Improvements

Planned improvements include:

- add a CI job for the Bruno collection;
- document the CI execution in the execution report;
- add a Node.js version file;
- publish selected non-sensitive evidence;
- add API health prechecks;
- improve failure classification for external instability;
- add controlled retry and timeout analysis;
- evaluate OpenAPI contract validation if a specification becomes available;
- review dependency audit findings periodically;
- add badges for additional quality checks when implemented.

---

## Portfolio Value

This project demonstrates that the repository owner can explain:

- how an API test strategy is created;
- how test scenarios are derived;
- why negative tests matter;
- how authentication differs from authorization;
- how API resources integrate;
- how test data is isolated;
- how cleanup is implemented;
- how JSON contracts are validated;
- how defects are documented;
- how requirements are traced to automated tests;
- how secrets are handled securely;
- how CI protects the main branch;
- how limitations affect test interpretation.

---

<div align="center">

Built as a practical QA automation portfolio project.

</div>
