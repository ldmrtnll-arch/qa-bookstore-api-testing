import type { JSONSchemaType } from 'ajv';

export const authorizedResponseSchema: JSONSchemaType<boolean> =
  {
    type: 'boolean',
  };