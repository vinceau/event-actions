export interface Action {
  name: string;
  transform?: boolean;
  args?: any;
}

export type ActionType = (args?: any) => Promise<any>;
export type ActionTypeGenerator = (args?: any) => ActionType;

export class EventManager {
  private eventActions: Map<string, Action[]>;
  private allActions: Map<string, ActionTypeGenerator>;

  public constructor() {
    this.eventActions = new Map<string, Action[]>();
    this.allActions = new Map<string, ActionTypeGenerator>();
  }

  public registerAction(actionName: string, action: ActionTypeGenerator): void {
    this.allActions.set(actionName, action);
  }

  public async emitEvent(eventName: string, ...args: any[]): Promise<any> {
    const eventActions = this.eventActions.get(eventName);
    if (!eventActions || eventActions.length === 0) {
      return null;
    }
    let prevReturn = args;
    for (const a of eventActions) {
      const action = this.allActions.get(a.name);
      if (!action) {
        continue;
      }
      const actionFunc = action(a.args);
      if (a.transform) {
        // This is a transforming action so take the previous returned arguments
        // and store them for the next transforming action
        prevReturn = await actionFunc(...prevReturn);
      } else {
        // This is not a transforming action so take the original arguments
        // that came with the emitted event
        await actionFunc(...args);
      }
    }
    return prevReturn;
  }

  public registerEvent(eventName: string, action: Action): void {
    let existingEvents = this.eventActions.get(eventName);
    if (!existingEvents) {
      existingEvents = [];
    }
    existingEvents.push(action);
    this.eventActions.set(eventName, existingEvents);
  }

}
