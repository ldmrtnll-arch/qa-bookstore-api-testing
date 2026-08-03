import type { JSONSchemaType } from 'ajv';
import type { BooksResponse } from '../types/book';
import { bookSchema } from './book.schema';

export const booksResponseSchema: JSONSchemaType<BooksResponse> = {
  type: 'object',
  additionalProperties: false,
  required: ['books'],
  properties: {
    books: {
      type: 'array',
      minItems: 1,
      items: bookSchema,
    },
  },
};