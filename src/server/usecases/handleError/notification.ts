export interface Notification {
  notify(error: unknown): Promise<void>;
}
