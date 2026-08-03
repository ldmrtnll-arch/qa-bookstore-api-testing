import type { JSONSchemaType } from 'ajv';
import type { UserDetailsResponse } from '../types/user-details';
import { bookSchema } from './book.schema';

export const userDetailsResponseSchema: JSONSchemaType<UserDetailsResponse> =
  {
    type: 'object',
    additionalProperties: false,
    required: ['userId', 'username', 'books'],
    properties: {
      userId: {
        type: 'string',
        pattern:
          '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$',
      },
      username: {
        type: 'string',
        minLength: 1,
      },
      books: {
        type: 'array',
        items: bookSchema,
      },
    },
  };