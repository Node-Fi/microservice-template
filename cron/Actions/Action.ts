export class ActionResolver {
  private actions: Map<string, Action> = new Map();
  private static instance: ActionResolver;

  private constructor() {
    if (ActionResolver.instance) {
      throw new Error('Cannot instantiate ActionResolver twice');
    }
  }

  public static clear() {
    this.instance = undefined;
  }

  public static getInstance(): ActionResolver {
    if (!this.instance) {
      this.instance = new ActionResolver();
    }
    return this.instance;
  }

  public registerAction<T extends Record<string, unknown>, R = void>(
    action: Action<T, R>,
  ) {
    this.actions.set(action.name, action);
  }

  public resolveAction<T extends Record<string, unknown>, R = void>(
    name: string,
  ): Action<T, R> {
    const action = this.actions.get(name) as Action<T, R>;

    if (!action) {
      throw new Error(`Action ${name} not found`);
    }

    return action;
  }
}

export abstract class Action<
  T extends Record<string, unknown> = Record<string, unknown>,
  R = unknown,
> {
  constructor(public name: string) {
    ActionResolver.getInstance().registerAction(this);
  }

  public abstract run(args: T): Promise<R>;
}
