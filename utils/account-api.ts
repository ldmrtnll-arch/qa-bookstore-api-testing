import type {
  APIRequestContext,
  APIResponse,
} from '@playwright/test';
import {
  generateUniqueUsername,
  validUserPassword,
} from '../test-data/users-data';
import type { GenerateTokenResponse } from '../types/authentication';
import type { CreatedUserResponse } from '../types/user';

export interface TestUserCredentials {
  userName: string;
  password: string;
}

export interface CreatedTestUser {
  userID: string;
  credentials: TestUserCredentials;
}

export interface AuthenticatedTestUser extends CreatedTestUser {
  token: string;
}

async function getResponseBodySafely(
  response: APIResponse,
): Promise<string> {
  try {
    return await response.text();
  } catch {
    return 'Response body could not be read.';
  }
}

async function ensureExpectedStatus(
  response: APIResponse,
  expectedStatus: number,
  operation: string,
): Promise<void> {
  if (response.status() === expectedStatus) {
    return;
  }

  const responseBody = await getResponseBodySafely(response);

  throw new Error(
    `${operation} failed. Expected status ${expectedStatus}, ` +
      `but received ${response.status()}. Body: ${responseBody}`,
  );
}

export async function createTestUser(
  request: APIRequestContext,
): Promise<CreatedTestUser> {
  const credentials: TestUserCredentials = {
    userName: generateUniqueUsername(),
    password: validUserPassword,
  };

  const response = await request.post('/Account/v1/User', {
    data: credentials,
  });

  await ensureExpectedStatus(
    response,
    201,
    'Test user creation',
  );

  const responseBody =
    (await response.json()) as CreatedUserResponse;

  if (!responseBody.userID) {
    throw new Error(
      'Test user creation succeeded, but userID was not returned.',
    );
  }

  return {
    userID: responseBody.userID,
    credentials,
  };
}

export async function generateTokenForUser(
  request: APIRequestContext,
  credentials: TestUserCredentials,
): Promise<GenerateTokenResponse> {
  const response = await request.post(
    '/Account/v1/GenerateToken',
    {
      data: credentials,
    },
  );

  await ensureExpectedStatus(
    response,
    200,
    'Token generation',
  );

  const responseBody =
    (await response.json()) as GenerateTokenResponse;

  if (!responseBody.token) {
    throw new Error(
      'Token generation succeeded, but no token was returned.',
    );
  }

  return responseBody;
}

export async function createAuthenticatedTestUser(
  request: APIRequestContext,
): Promise<AuthenticatedTestUser> {
  const createdUser = await createTestUser(request);

  const generatedToken = await generateTokenForUser(
    request,
    createdUser.credentials,
  );

  return {
    ...createdUser,
    token: generatedToken.token,
  };
}

export async function deleteTestUser(
  request: APIRequestContext,
  userID: string,
  token: string,
): Promise<APIResponse> {
  return request.delete(`/Account/v1/User/${userID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function cleanupTestUser(
  request: APIRequestContext,
  userID: string,
  token: string,
): Promise<void> {
  const response = await deleteTestUser(
    request,
    userID,
    token,
  );

  await ensureExpectedStatus(
    response,
    204,
    'Test user cleanup',
  );
}