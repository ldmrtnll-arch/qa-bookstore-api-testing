import Ajv, { type AnySchema } from 'ajv';

const ajv = new Ajv({
  allErrors: true,
  strict: true,
});

export function assertMatchesSchema<T>(
  schema: AnySchema,
  data: unknown,
  schemaName: string,
): asserts data is T {
  const validate = ajv.compile<T>(schema);
  const isValid = validate(data);

  if (isValid) {
    return;
  }

  const validationErrors = ajv.errorsText(
    validate.errors,
    {
      separator: '\n',
    },
  );

  throw new Error(
    `${schemaName} schema validation failed:\n${validationErrors}`,
  );
}