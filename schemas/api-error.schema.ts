import type { JSONSchemaType } from 'ajv';
import type { ApiErrorResponse } from '../types/api-error';

export const apiErrorSchema: JSONSchemaType<ApiErrorResponse> = {
  type: 'object',
  additionalProperties: false,
  required: ['code', 'message'],
  properties: {
    code: {
      type: 'string',
      minLength: 1,
    },
    message: {
      type: 'string',
      minLength: 1,
    },
  },
};