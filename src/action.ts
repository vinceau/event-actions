export interface Action {
  name: string;
  transform?: boolean;
  args?: any;
}

export type ActionType = (args?: any) => Promise<any>;
export type ActionTypeGenerator = (args?: any) => ActionType;

export type EventActions = { [event: string]: Action[] }

export class EventManager {
  private eventActions: EventActions = {};
  private allActions = new Map<string, ActionTypeGenerator>();

  public registerAction(actionName: string, action: ActionTypeGenerator): void {
    this.allActions.set(actionName, action);
  }

  public listRegisteredActions(): string[] {
    return Array.from(this.allActions.keys());
  }

  public async emitEvent(eventName: string, ...args: any[]): Promise<any> {
    const eventActions = this.eventActions[eventName];
    if (!eventActions || eventActions.length === 0) {
      return null;
    }
    let prevReturn = args;
    for (const a of eventActions) {
      const action = this.allActions.get(a.name);
      // Skip if it doesn't exist
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

  public getActions(eventName: string): Action[] {
    const actions = this.eventActions[eventName] || [];
    // Return a copy
    return Array.from(actions);
  }

  public getAllEventActions(): EventActions {
    // Return a copy
    return Object.assign({}, this.eventActions);
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
