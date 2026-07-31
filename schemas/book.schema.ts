import type { JSONSchemaType } from 'ajv';
import type { Book } from '../types/book';

export const bookSchema: JSONSchemaType<Book> = {
  type: 'object',
  additionalProperties: false,
  required: [
    'isbn',
    'title',
    'subTitle',
    'author',
    'publish_date',
    'publisher',
    'pages',
    'description',
    'website',
  ],
  properties: {
    isbn: {
      type: 'string',
      minLength: 1,
    },
    title: {
      type: 'string',
      minLength: 1,
    },
    subTitle: {
      type: 'string',
      minLength: 1,
    },
    author: {
      type: 'string',
      minLength: 1,
    },
    publish_date: {
      type: 'string',
      minLength: 1,
    },
    publisher: {
      type: 'string',
      minLength: 1,
    },
    pages: {
      type: 'integer',
      minimum: 1,
    },
    description: {
      type: 'string',
      minLength: 1,
    },
    website: {
      type: 'string',
      minLength: 1,
      pattern: '^https?://.+',
    },
  },
};