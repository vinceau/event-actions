import { EventManager }  from "../src/action";
import { AddOne, AddTwo, AddFive, SubOne }  from "./testActions";

describe("action events", () => {

  it("correctly calculates result for a single action", async () => {
    const mgr = new EventManager();
    const eventName = "testEvent";
    mgr.registerEvent(eventName, new AddOne());
    let res: number;
    res = await mgr.emitEvent(eventName, 1);
    expect(res).toBe(2);
    res = await mgr.emitEvent(eventName, 2);
    expect(res).toBe(3);
    res = await mgr.emitEvent(eventName, 3);
    expect(res).toBe(4);
  });

  it("correctly calculates result for chained actions", async () => {
    const mgr = new EventManager();
    const eventName = "testEvent";
    mgr.registerEvent(eventName, new AddOne());
    mgr.registerEvent(eventName, new AddTwo());
    mgr.registerEvent(eventName, new AddFive());
    mgr.registerEvent(eventName, new SubOne());
    let res;
    res = await mgr.emitEvent(eventName, 2);
    expect(res).toBe(9);
    res = await mgr.emitEvent(eventName, 3);
    expect(res).toBe(10);
    res = await mgr.emitEvent(eventName, 4);
    expect(res).toBe(11);
  });

});
