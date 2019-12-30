export interface Action {
  run(...args: any[]): Promise<any>;
}


export class EventManager {
  private events: Map<string, Action[]>;

  public constructor() {
    this.events = new Map<string, Action[]>();
  }


  public async emitEvent(eventName: string, ...args: any[]): Promise<any> {
    const events = this.events.get(eventName);
    if (!events || events.length === 0) {
      return null;
    }
    let prevReturn = args;
    for (const event of events) {
      prevReturn = await event.run(...prevReturn);
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
