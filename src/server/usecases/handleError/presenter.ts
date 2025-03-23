export interface HandleErrorPresenter<T> {
  output(error: unknown): T;
}
