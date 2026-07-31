import { randomUUID } from 'node:crypto';

export const validUserPassword = '***REMOVED***';

export const invalidUserPassword = 'weak';

export const userAlreadyExistsError = {
  code: '1204',
  message: 'User exists!',
};

export const passwordRequirementsError = {
  code: '1300',
  message:
    "Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.",
};

export const usernameAndPasswordRequiredError = {
  code: '1200',
  message: 'UserName and Password required.',
};

export const userNotFoundError = {
  code: '1207',
  message: 'User not found!',
};

export function generateUniqueUsername(): string {
  const uniqueSuffix = randomUUID()
    .replaceAll('-', '')
    .slice(0, 8);

  return `qa_portfolio_${Date.now()}_${uniqueSuffix}`;
}