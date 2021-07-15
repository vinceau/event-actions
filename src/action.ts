import { delay } from "./utils";

export interface Action {
  name: string;
  args?: any;
  msDelay?: number;
  children?: Action[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Context extends Record<string, any> {};
export interface EventActions {
  [event: string]: Action[];
}

export type ActionType = (ctx: Context) => Promise<Context>;
export type ActionTypeGenerator = (args?: any) => ActionType;

export class EventManager {
  public eventActions: EventActions = {};
  private allActions = new Map<string, ActionTypeGenerator>();

  public registerAction(actionName: string, action: ActionTypeGenerator): void {
    this.allActions.set(actionName, action);
  }

  public listRegisteredActions(): string[] {
    return Array.from(this.allActions.keys());
  }

  public async emitEvent(eventName: string, context?: Context): Promise<void> {
    const ctx: Context = Object.assign({}, context);
    const eventActions = this.eventActions[eventName];
    if (!eventActions || eventActions.length === 0) {
      return;
    }
    return this.execute(eventActions, ctx);
  }

  /**
   * Execute a the given list of actions using the provided arguments.
   *
   * @param {Action[]} eventActions The list of actions to be executed
   * @param {...any[]} args The arguments to start the action chain with
   * @returns {Promise<any>} The value at the end of the chain
   * @memberof EventManager
   */
  public async execute(eventActions: Action[], context?: Context): Promise<void> {
    const ctx: Context = Object.assign({}, context);
    const promises = eventActions.map(action => this.executeSingleAction(action, ctx));
    await Promise.all(promises);
  }

  private async executeSingleAction(eventAction: Action, context: Context): Promise<void> {
    // Execute the action and pass the resulting context to all the child actions

    // First delay if need be
    if (eventAction.msDelay && eventAction.msDelay > 0) {
      await delay(eventAction.msDelay);
    }

    // Execute the action if it exists
    const action = this.allActions.get(eventAction.name);
    let newContext: Context = context;
    if (action) {
      const actionFunc = action(eventAction.args);
      newContext = await actionFunc(context);
    }

    if (eventAction.children && eventAction.children.length > 0) {
      return this.execute(eventAction.children, newContext);
    }
  }

  public getActions(eventName: string): Action[] {
    const actions = this.eventActions[eventName] || [];
    // Return a copy
    return Array.from(actions);
  }

  /**
   * Removes the action for an event at the given index
   *
   * @param {string} eventName The name of the event
   * @param {number} index The index of the action to be removed
   * @returns {boolean} Whether the removal was successful
   * @memberof EventManager
   */
  public removeEventAction(eventName: string, index: number): boolean {
    const list = this.eventActions[eventName];
    if (!list) {
      return false;
    }
    const res = list.splice(index, 1)
    return res.length > 0;
  }

  public setEventActions(eventName: string, actions: Action[]): void {
    this.eventActions[eventName] = actions;
  }

  public registerEvent(eventName: string, action: Action): void {
    let existingEvents = this.eventActions[eventName];
    if (!existingEvents) {
      existingEvents = [];
    }
    existingEvents.push(action);
    this.eventActions[eventName] = existingEvents;
  }

  public serialize(): string {
    return JSON.stringify(this.eventActions);
  }

  public deserialize(jsonStr: string): void {
    this.eventActions = JSON.parse(jsonStr);
  }

}
