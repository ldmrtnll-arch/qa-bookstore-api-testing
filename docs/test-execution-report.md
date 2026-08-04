# API Test Execution Report

## Document Information

| Field | Value |
|---|---|
| Project | QA Bookstore API Testing |
| Application | DemoQA Book Store API |
| Document type | Test execution report |
| Execution date | 2026-08-04 |
| Execution environment | Local Windows environment using PowerShell |
| Test tools | Playwright API, TypeScript and Bruno CLI |
| Branch used for the recorded local execution | `docs/api-test-documentation` |
| CI validation branch | `main` |
| Overall result | Local regression passed with one known skipped scenario; GitHub Actions passed |

---

## 1. Purpose

This report records the results of the local regression execution performed after:

- moving the valid test password to environment variables;
- validating the cleaned Git history;
- rebuilding the documentation branch;
- confirming that the Playwright and Bruno suites still worked after the security changes.

Only results observed in the actual command outputs are recorded here.

---

## 2. Execution Scope

The execution covered:

- TypeScript static validation;
- Playwright API regression tests;
- account creation, retrieval and deletion;
- token generation;
- authorization rules;
- book catalog operations;
- user collection operations;
- positive, negative and integration scenarios;
- JSON contract validation;
- Bruno command-line collection execution.

The execution did not include:

- performance testing;
- database validation;
- user interface testing;
- production monitoring.

---

## 3. Commands Executed

### TypeScript validation

```powershell
npm run typecheck
```

### Playwright regression suite

```powershell
npm test
```

### Bruno CLI collection

```powershell
npm run test:bruno
```

---

## 4. TypeScript Validation Result

| Metric | Result |
|---|---|
| Command | `npm run typecheck` |
| Script | `tsc --noEmit` |
| Compilation errors | 0 |
| Result | Passed |

The command completed without TypeScript errors.

---

## 5. Playwright Regression Result

### Summary

| Metric | Result |
|---|---:|
| Discovered tests | 32 |
| Passed | 31 |
| Failed | 0 |
| Skipped | 1 |
| Execution duration | Approximately 1 minute |
| Workers | 4 |
| Overall result | Passed with one known skipped scenario |

### Result by Functional Area

| Area | Implemented Tests | Passed | Skipped | Failed |
|---|---:|---:|---:|---:|
| Account | 7 | 7 | 0 | 0 |
| Token generation | 5 | 5 | 0 | 0 |
| Authorization | 5 | 5 | 0 | 0 |
| Book catalog | 5 | 4 | 1 | 0 |
| User collection | 10 | 10 | 0 | 0 |
| Total | 32 | 31 | 1 | 0 |

### Skipped Scenario

| Field | Value |
|---|---|
| Test case | `API-BKS-005` |
| Title | Validate the response when the ISBN parameter is missing |
| Test file | `tests/books/get-book-by-isbn.spec.ts` |
| Current treatment | Marked with `test.fixme` |
| Related defect | `BUG-API-001` |

The scenario was not counted as passed.

It remains skipped because the endpoint does not complete the request within the expected time when the `ISBN` query parameter is omitted.

### Playwright Result Interpretation

The regression suite completed without failed tests.

The observed result was:

```text
31 passed
1 skipped
0 failed
```

The skipped test represents a known product behavior and not a newly introduced automation failure.

---

## 6. Bruno CLI Result

### Summary

| Metric | Result |
|---|---:|
| Status | Passed |
| Requests | 11 |
| Passed requests | 11 |
| Tests | 20/20 |
| Assertions | 54/54 |
| Duration | 12,789 ms |
| Failed requests | 0 |
| Failed tests | 0 |
| Failed assertions | 0 |

### Executed Bruno Flow

The Bruno collection executed the following request flow:

1. Create user.
2. Generate token.
3. Retrieve the available books.
4. Retrieve one book by ISBN.
5. Validate an unavailable ISBN.
6. Add a book to the user collection.
7. Retrieve the populated user collection.
8. Remove the book from the collection.
9. Retrieve the empty user collection.
10. Delete the user.
11. Confirm that the deleted user is no longer available.

### Bruno Execution Details

| Request | Expected Status | Observed Status |
|---|---:|---:|
| Create User | 201 | 201 |
| Generate Token | 200 | 200 |
| Get Books | 200 | 200 |
| Get Book by ISBN | 200 | 200 |
| Get Book by Unavailable ISBN | 400 | 400 |
| Add Book to Collection | 201 | 201 |
| Get User Collection | 200 | 200 |
| Remove Book from Collection | 204 | 204 |
| Get Empty User Collection | 200 | 200 |
| Delete User | 204 | 204 |
| Get Deleted User | 401 | 401 |

All Bruno requests, tests and assertions passed in the recorded execution.

---

## 7. Security Validation Performed Before Execution

The security change was validated before the regression run.

The following checks were completed:

- the valid password was removed from tracked source code;
- `.env` remained ignored by Git;
- `bruno/.env` remained ignored by Git;
- `.env.example` contained only a placeholder;
- the Playwright configuration loaded the local environment file;
- missing required environment variables produced a clear error;
- staged files were checked for JWT-like values;
- no real Bearer token was committed;
- the old credential was removed from the rewritten normal branch history;
- the credential was rotated before the final execution.

The local test suites passed after these changes.

---

## 8. Defects and Observations

### BUG-API-001

| Field | Value |
|---|---|
| Description | The single-book endpoint does not complete when the ISBN parameter is omitted |
| Related test | `API-BKS-005` |
| Execution result | Skipped with `test.fixme` |
| Regression impact | Does not block the remaining 31 scenarios |
| Status | Open external product defect |

### BUG-API-002

| Field | Value |
|---|---|
| Description | The generated JWT payload exposes the user's password in plaintext |
| Detection method | Security inspection |
| Functional-suite impact | No failed functional test |
| Mitigation | Tokens are not logged, documented or committed |
| Status | Open external security defect |

---

## 9. GitHub Actions Execution Result

A GitHub Actions execution was triggered after publishing the final README to `main`.

### Confirmed CI Information

| Field | Result |
|---|---|
| Workflow | `API Tests` |
| Trigger | Push to `main` |
| Commit | `f0215ca` — `docs: add project README` |
| Branch | `main` |
| Workflow result | Passed |
| GitHub check result | 1 check passed |
| Observed duration | 1 minute and 24 seconds |
| Playwright artifact | `playwright-report-3` |
| Artifact size | 217 KB |

### CI Workflow Scope

The configured workflow contains the following steps:

1. Check out the repository.
2. Configure Node.js 24.
3. Install dependencies with `npm ci`.
4. Run TypeScript validation.
5. Run the Playwright API suite.
6. Upload Playwright reports and test results.

### CI Result Interpretation

The workflow completed successfully and produced the expected Playwright report artifact.

The GitHub interface confirmed:

```text
API Tests: passed
1 check passed
Artifact: playwright-report-3
Artifact size: 217 KB
```

The workflow result confirms that the project can be cloned, configured with the repository secret and executed in GitHub Actions.

The GitHub Actions page was not used to extract a second per-test numerical summary. Therefore, the detailed counts of `31 passed` and `1 skipped` in this report remain the results of the recorded local regression execution.

---

## 10. Final Result

| Validation | Result |
|---|---|
| TypeScript | Passed |
| Playwright | Passed with one known skipped scenario |
| Bruno | Passed |
| GitHub Actions | Passed |
| CI report artifact | Generated successfully |
| Failed automated tests in the recorded local regression | 0 |
| Known skipped scenarios in the recorded local regression | 1 |
| Overall project validation | Passed |

The project remained functional after the environment-variable and Git-history security changes.

The recorded execution confirms:

- 31 passing Playwright scenarios;
- 1 intentionally skipped Playwright scenario linked to a known defect;
- 11 passing Bruno requests;
- 20 passing Bruno tests;
- 54 passing Bruno assertions;
- no TypeScript compilation errors.

---

## 11. Evidence and Report Availability

Playwright generated its local HTML report through the configured reporter.

The report can be opened locally with:

```powershell
npx playwright show-report
```

Generated report and execution-artifact folders are ignored by Git by default.

The successful GitHub Actions execution uploaded:

```text
playwright-report-3
```

Recorded artifact size:

```text
217 KB
```

Evidence intended for the portfolio should not contain:

- passwords;
- Bearer tokens;
- complete JWT values;
- reusable test credentials;
- sensitive request headers.

---

## 12. Limitations of This Report

- The results represent one local execution performed on 2026-08-04.
- The tested API is an external public dependency.
- Future executions may differ because of availability, latency or API behavior changes.
- The report does not claim that the skipped scenario passed.
- The report does not include performance or database results.
- The detailed Playwright test counts were recorded from the local regression execution.
- The CI result confirms overall workflow success and artifact generation, but this report does not invent per-test CI counts that were not inspected in the workflow logs.
