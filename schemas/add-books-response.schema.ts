import type { JSONSchemaType } from 'ajv';
import type { AddBooksResponse } from '../types/book-collection';

export const addBooksResponseSchema: JSONSchemaType<AddBooksResponse> =
  {
    type: 'object',
    additionalProperties: false,
    required: ['books'],
    properties: {
      books: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['isbn'],
          properties: {
            isbn: {
              type: 'string',
              minLength: 1,
            },
          },
        },
      },
    },
  };