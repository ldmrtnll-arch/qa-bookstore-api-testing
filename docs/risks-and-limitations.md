# Risks and Limitations

## Document Information

| Field | Value |
|---|---|
| Project | QA Bookstore API Testing |
| Application | DemoQA Book Store API |
| Document type | Risks and limitations |
| Test layers | API, integration and contract testing |
| Automation tools | Playwright API and Bruno |
| Status | Current |

---

## 1. Purpose

This document records the main technical, operational and test-related risks identified during the project.

It also describes:

- the impact of each risk;
- the current mitigation;
- known project limitations;
- residual risks that remain outside the control of this repository;
- recommended future improvements.

The purpose is to make the project transparent and to show that test results must always be interpreted together with the environment, dependencies and known defects.

---

## 2. Risk Assessment Scale

### Probability

| Level | Description |
|---|---|
| Low | Unlikely to happen during normal execution |
| Medium | May happen depending on external conditions |
| High | Has already happened or is likely to happen again |

### Impact

| Level | Description |
|---|---|
| Low | Small effect with no meaningful loss of test coverage |
| Medium | Causes partial execution failure, instability or misleading results |
| High | Blocks important tests, exposes sensitive data or invalidates results |

---

## 3. Technical Risks

| Risk ID | Risk | Probability | Impact | Current Mitigation | Residual Risk |
|---|---|---:|---:|---|---|
| RISK-001 | The external DemoQA API may become unavailable, slow or unstable | High | High | Timeouts, independent tests, cleanup and repeated local validation | Tests can still fail because the API is outside this repository's control |
| RISK-002 | The external API may change response contracts or business rules without notice | Medium | High | JSON Schema validation, field-level assertions and explicit expected messages | Legitimate external changes may require test and documentation updates |
| RISK-003 | Requests may fail because of TLS or certificate-chain issues in the execution environment | Medium | Medium | Playwright is configured with `ignoreHTTPSErrors: true` for this test API | This setting is acceptable for the demo environment but should not be copied blindly to production projects |
| RISK-004 | Parallel execution may increase API rate, create contention or expose timing-related instability | Medium | Medium | Unique usernames, isolated test data and independent scenarios | The public API may still throttle or delay requests |
| RISK-005 | Cleanup requests may fail after the main assertion completes | Medium | Medium | Tests use cleanup flows whenever possible | Temporary test users or collections may remain in the external environment |
| RISK-006 | A generated token may expire before a long-running flow completes | Low | Medium | Tokens are generated inside each isolated scenario | Very slow external responses could still cause expiration-related failures |
| RISK-007 | An unavailable or modified catalog item may invalidate static book expectations | Medium | Medium | Catalog-list tests and reusable book data are validated against current responses where applicable | Tests using known ISBN data may require maintenance if the public catalog changes |
| RISK-008 | Dependency vulnerabilities may exist in transitive npm packages | Medium | Medium | Dependencies and npm audit results are reviewed | Some transitive findings may not have a compatible fix controlled by this project |
| RISK-009 | Node.js behavior may differ between local and CI environments | Medium | Medium | Type checking, explicit scripts and environment-variable validation | Different Node versions may affect APIs such as `.env` loading |
| RISK-010 | CRLF and LF normalization may create noisy Git warnings on Windows | High | Low | Warnings are reviewed with `git diff --check` | Line-ending warnings may continue depending on Git configuration |

---

## 4. Security Risks

| Risk ID | Risk | Probability | Impact | Current Mitigation | Residual Risk |
|---|---|---:|---:|---|---|
| RISK-SEC-001 | A valid test password may be committed to the repository | Medium | High | Passwords are loaded from `.env`; `.env` is ignored; `.env.example` contains only a placeholder | A contributor could still accidentally bypass the established pattern |
| RISK-SEC-002 | Authentication tokens may be copied into logs, documentation or evidence | Medium | High | Tokens are not stored in repository files and staged content is checked for JWT-like patterns | Manual screenshots or copied terminal output could still expose tokens |
| RISK-SEC-003 | The external API generates JWT payloads containing the user's plaintext password | High | High | Documented as `BUG-API-002`; tokens are never logged or committed | The defect belongs to the external API and cannot be fixed in this repository |
| RISK-SEC-004 | Historical Git references may preserve previously committed secrets | Low | High | Current branch history was rewritten and the credential was rotated | External cached references may remain outside normal branch history |
| RISK-SEC-005 | An invalid test credential may be reused in another context | Low | High | The project requires dedicated test-only credentials | Human misuse cannot be fully prevented by automation |
| RISK-SEC-006 | One user may attempt to modify another user's collection | Medium | High | Covered by `API-COL-010` with object-level authorization validation | Other authorization paths not present in the current API remain untested |

---

## 5. Test Execution Risks

| Risk ID | Risk | Probability | Impact | Current Mitigation | Residual Risk |
|---|---|---:|---:|---|---|
| RISK-EXE-001 | A passing test may only reflect the current external environment state | High | Medium | Results are documented by execution date and command | Passing results are not permanent guarantees |
| RISK-EXE-002 | A failed test may be caused by the external environment rather than a product regression | High | Medium | Assertions, logs and follow-up verification are used to investigate failures | Root cause may still require rerunning or checking the API manually |
| RISK-EXE-003 | A skipped test may be misinterpreted as passed | Medium | High | `API-BKS-005` is explicitly marked with `test.fixme` and linked to `BUG-API-001` | Readers may ignore the distinction if they only look at total test count |
| RISK-EXE-004 | The suite may leave data behind when interrupted manually | Medium | Medium | Cleanup exists inside completed scenarios | Forced termination may prevent cleanup code from running |
| RISK-EXE-005 | Bruno and Playwright may validate overlapping flows differently | Medium | Low | Bruno is treated as a representative flow, while Playwright provides broader scenario coverage | Tool-specific assertions may diverge if one suite is updated without the other |
| RISK-EXE-006 | A local `.env` may be missing or contain an invalid password | Medium | Medium | Required environment variables are validated with a clear error message | Execution remains blocked until valid test data is provided |
| RISK-EXE-007 | Test evidence may become outdated after code or API changes | Medium | Medium | Evidence and execution reports should be regenerated after meaningful changes | Historical reports can still be mistaken for current results |

---

## 6. Known Product Defects

### BUG-API-001 — Request does not complete when ISBN is omitted

The endpoint:

```text
GET /BookStore/v1/Book
```

does not complete the request within the expected time when the `ISBN` query parameter is omitted.

Current treatment:

- documented in `docs/bug-reports.md`;
- linked to `REQ-BKS-005`;
- linked to `API-BKS-005`;
- automated test marked with `test.fixme`;
- excluded from the passing regression count.

Impact:

- validation behavior cannot be confirmed automatically;
- the endpoint may consume client and server resources unnecessarily;
- the regression suite would be blocked if the scenario were executed normally.

---

### BUG-API-002 — Generated JWT payload exposes the password

The token generated by the external API contains the user's password in plaintext inside the JWT payload.

Current treatment:

- documented in `docs/bug-reports.md`;
- tokens are not written to logs, documentation or evidence;
- passwords are loaded from ignored environment files;
- staged files are checked for JWT-like values before commits.

Impact:

- anyone with access to the token may decode and read the password;
- token leakage becomes equivalent to credential leakage;
- the defect cannot be corrected in this repository because it belongs to the external API.

---

## 7. Project Limitations

### 7.1 External environment ownership

The DemoQA Book Store API is not maintained by this project.

Therefore, this repository cannot control:

- service availability;
- response latency;
- data reset policies;
- catalog changes;
- server logs;
- infrastructure configuration;
- authentication implementation;
- production fixes for reported defects.

---

### 7.2 Scope limited to API testing

This project focuses on API, integration and contract testing.

The following areas are not included:

- web user interface testing;
- mobile testing;
- accessibility testing;
- visual regression testing;
- browser compatibility testing;
- production monitoring;
- infrastructure testing;
- penetration testing;
- full security auditing.

---

### 7.3 Performance testing is not included

The current suite does not measure:

- throughput;
- percentile response times;
- maximum concurrent users;
- rate limits;
- stress limits;
- soak behavior;
- recovery after overload.

Performance testing with k6 is reserved for a separate portfolio project where workload modeling and thresholds can be documented properly.

---

### 7.4 Database access is unavailable

The project does not have direct access to the application database.

Data consistency is validated only through public API responses.

The suite cannot directly verify:

- database constraints;
- transactions;
- indexes;
- row-level persistence;
- replication;
- orphaned records;
- internal cleanup jobs.

---

### 7.5 No service virtualization

The project currently uses the real public API and does not provide mocks or stubs.

This means:

- tests depend on network access;
- external failures cannot be simulated deterministically;
- retry, timeout and dependency-failure scenarios are limited;
- contract changes cannot be isolated before they reach the public environment.

---

### 7.6 Limited observability

The project does not have access to backend logs, traces or correlation IDs generated by the service.

Root-cause analysis is limited to:

- request data;
- response status;
- response headers;
- response body;
- client-side duration;
- reproducible test evidence.

---

### 7.7 Bruno scope is representative, not exhaustive

The Bruno collection validates one representative account and book-collection flow.

It does not duplicate all 32 Playwright cases.

This is intentional because:

- Playwright is the main automated regression suite;
- Bruno demonstrates portable API collection execution;
- duplicating every negative scenario would add maintenance without proportional value.

---

### 7.8 Current CI coverage

GitHub Actions is not yet configured in the current project state.

Until CI is added:

- tests depend on manual execution;
- pull requests do not receive automatic validation;
- environment secrets are not yet configured in GitHub;
- reports are not automatically uploaded as workflow artifacts.

---

## 8. Mitigation Plan

| Priority | Action | Expected Benefit | Status |
|---|---|---|---|
| High | Configure GitHub Actions for type checking and Playwright execution | Automatic validation on pushes and pull requests | Pending |
| High | Store the test password as a GitHub Actions secret | Secure CI execution without hardcoded credentials | Pending |
| High | Upload Playwright HTML reports as CI artifacts | Easier failure investigation and evidence retention | Pending |
| Medium | Add retry only in CI | Reduce noise caused by temporary external instability | Already configured in Playwright |
| Medium | Add execution-date and environment details to the test execution report | Improve result traceability | Pending |
| Medium | Review npm audit findings regularly | Reduce dependency risk | Ongoing |
| Medium | Add a documented Node.js version | Improve consistency between local and CI environments | Pending |
| Low | Add service-health prechecks before the suite | Distinguish external outage from functional failure | Future improvement |
| Low | Add contract tests against an OpenAPI specification if one becomes available | Improve formal contract coverage | Future improvement |
| Low | Add controlled performance tests in a separate project | Measure basic reliability and response-time thresholds | Future portfolio project |

---

## 9. Acceptance of Residual Risk

The current project is appropriate for a junior QA portfolio because it demonstrates:

- realistic API testing decisions;
- positive and negative coverage;
- contract validation;
- account and collection lifecycle testing;
- authentication and authorization checks;
- data cleanup;
- documented defects;
- secure test-data handling;
- transparent limitations.

The remaining risks are accepted because the tested application is an external public demo API and the repository does not own its source code or infrastructure.

These limitations must be considered whenever test results are reviewed.
