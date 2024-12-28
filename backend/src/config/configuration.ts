export const configuration = () => ({
  hassioUrl: process.env.HASSIO_URL,
  hassioAuthToken: process.env.HASSIO_AUTH_TOKEN,
  garageDoor: process.env.GARAGE_DOOR,
  garageTemperature: process.env.GARAGE_TEMPERATURE,
  outsideTemperature: process.env.OUTSIDE_TEMPERATURE,
});

/**
 * Flatten<T> is a utility type that flattens a nested object into a single
 * level object.
 */
type Flatten<T extends object> = {
  [K in keyof T as T[K] extends object
    ? never
    : // eslint-disable-next-line @typescript-eslint/ban-types
    T[K] extends Function
    ? never
    : K]: T[K];
} & ({
  [K in keyof T as T[K] extends object
    ? Extract<keyof Flatten<T[K]>, string>
    : never]: K;
} extends infer L
  ? {
      [K in keyof L as `${Extract<L[K], string>}.${Extract<
        K,
        string
      >}`]: Flatten<Extract<T[Extract<L[K], keyof T>], object>> extends infer F
        ? F[Extract<K, keyof F>]
        : never;
    }
  : never);

// Export the configuration type definition.
export type ConfigurationType = Flatten<ReturnType<typeof configuration>>;

// Override NestJS configuration type and add types for configuration keys.
declare module '@nestjs/config' {
  interface ConfigService {
    get<K extends keyof ConfigurationType>(key: K): ConfigurationType[K];
  }
}
