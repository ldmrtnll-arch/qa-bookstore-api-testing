export function getRequiredEnvironmentVariable(
  variableName: string,
): string {
  const value = process.env[variableName]?.trim();

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${variableName}. ` +
        'Copy .env.example to .env and provide a valid test value.',
    );
  }

  return value;
}