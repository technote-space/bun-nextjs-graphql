export const getEnv = <T>(key: string, defaultValue?: T): string | T => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error();
    }

    return defaultValue;
  }

  return value;
};

export const getStringEnv = (key: string, defaultValue?: string) =>
  getEnv<string>(key, defaultValue);
