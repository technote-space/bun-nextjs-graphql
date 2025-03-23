export interface HandleErrorUseCase {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  handle(error: unknown): Promise<any>;
}
