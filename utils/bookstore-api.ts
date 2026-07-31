import type {
  APIRequestContext,
  APIResponse,
} from '@playwright/test';
import type { BooksResponse } from '../types/book';
import type {
  AddBooksRequest,
  AddBooksResponse,
} from '../types/book-collection';
import type { UserDetailsResponse } from '../types/user-details';

export interface ApiResult<T> {
  response: APIResponse;
  body: T;
}

async function parseJsonResponse<T>(
  response: APIResponse,
): Promise<T> {
  return (await response.json()) as T;
}

export async function getBookCatalog(
  request: APIRequestContext,
): Promise<ApiResult<BooksResponse>> {
  const response = await request.get(
    '/BookStore/v1/Books',
  );

  const body =
    await parseJsonResponse<BooksResponse>(response);

  return {
    response,
    body,
  };
}

export async function addBookToUserCollection(
  request: APIRequestContext,
  userId: string,
  token: string,
  isbn: string,
): Promise<ApiResult<AddBooksResponse>> {
  const requestBody: AddBooksRequest = {
    userId,
    collectionOfIsbns: [
      {
        isbn,
      },
    ],
  };

  const response = await request.post(
    '/BookStore/v1/Books',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: requestBody,
    },
  );

  const body =
    await parseJsonResponse<AddBooksResponse>(
      response,
    );

  return {
    response,
    body,
  };
}

export async function getUserDetails(
  request: APIRequestContext,
  userId: string,
  token: string,
): Promise<ApiResult<UserDetailsResponse>> {
  const response = await request.get(
    `/Account/v1/User/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const body =
    await parseJsonResponse<UserDetailsResponse>(
      response,
    );

  return {
    response,
    body,
  };
}