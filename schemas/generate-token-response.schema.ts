import type {
  AnySchema,
  JSONSchemaType,
} from 'ajv';
import type {
  FailedGenerateTokenResponse,
  SuccessfulGenerateTokenResponse,
} from '../types/authentication';

export const successfulGenerateTokenResponseSchema: JSONSchemaType<SuccessfulGenerateTokenResponse> =
  {
    type: 'object',
    additionalProperties: false,
    required: [
      'token',
      'expires',
      'status',
      'result',
    ],
    properties: {
      token: {
        type: 'string',
        minLength: 1,
      },
      expires: {
        type: 'string',
        minLength: 1,
      },
      status: {
        type: 'string',
        const: 'Success',
      },
      result: {
        type: 'string',
        const: 'User authorized successfully.',
      },
    },
  };

export const failedGenerateTokenResponseSchema: AnySchema =
  {
    type: 'object',
    additionalProperties: false,
    required: [
      'token',
      'expires',
      'status',
      'result',
    ],
    properties: {
      token: {
        type: 'null',
      },
      expires: {
        type: 'null',
      },
      status: {
        type: 'string',
        const: 'Failed',
      },
      result: {
        type: 'string',
        const: 'User authorization failed.',
      },
    },
  };