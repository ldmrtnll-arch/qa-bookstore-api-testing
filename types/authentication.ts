export interface SuccessfulGenerateTokenResponse {
  token: string;
  expires: string;
  status: 'Success';
  result: 'User authorized successfully.';
}

export interface FailedGenerateTokenResponse {
  token: null;
  expires: null;
  status: 'Failed';
  result: 'User authorization failed.';
}

export type GenerateTokenResponse =
  | SuccessfulGenerateTokenResponse
  | FailedGenerateTokenResponse;