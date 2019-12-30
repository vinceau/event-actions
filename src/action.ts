export interface Action {
  name: string;
  args?: any;
}

export type ActionType = (args?: any) => Promise<any>;
export type ActionTypeGenerator = (args?: any) => ActionType;

export class EventManager {
  private events: Map<string, Action[]>;
  private actions: Map<string, ActionTypeGenerator>;

  public constructor() {
    this.events = new Map<string, Action[]>();
    this.actions = new Map<string, ActionTypeGenerator>();
  }

  public registerAction(actionName: string, action: ActionTypeGenerator): void {
    this.actions.set(actionName, action);
  }

  public async emitEvent(eventName: string, ...args: any[]): Promise<any> {
    const events = this.events.get(eventName);
    if (!events || events.length === 0) {
      return null;
    }
    let prevReturn = args;
    for (const event of events) {
      const action = this.actions.get(event.name);
      if (!action) {
        continue;
      }
      const actionFunc = action(event.args);
      prevReturn = await actionFunc(...prevReturn);
    }
    return prevReturn;
  }

  public registerEvent(eventName: string, action: Action): void {
    let existingEvents = this.events.get(eventName);
    if (!existingEvents) {
      existingEvents = [];
    }
    existingEvents.push(action);
    this.events.set(eventName, existingEvents);
  }

}
