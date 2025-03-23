export type Client = unknown;

export interface Repository<C extends Client = Client> {
  transaction<T>(callback: (client: C) => Promise<T>): Promise<T>;

  healthCheck(): Promise<boolean>;
}
