type CalledMethod = Readonly<{
  method: string;
  // biome-ignore lint/suspicious/noExplicitAny:
  args: any[];
}>;

export abstract class Mock {
  public readonly calledMethods: CalledMethod[] = [];

  // biome-ignore lint/suspicious/noExplicitAny:
  protected methodCalled(method: string, args: any[] = []) {
    this.calledMethods.push({ method, args });
  }
}
