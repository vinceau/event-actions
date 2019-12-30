import { EventManager }  from "../src/action";
import { AddOne, AddTwo, AddTogether, AddFive, SubOne, DivByTwo, AddCustom }  from "./testActions";

describe("action events", () => {

  it("correctly calculates result for a single action", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-one", AddOne);
    const eventName = "testEvent";
    mgr.registerEvent(eventName, {
      name: "add-one"
    });
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
    mgr.registerAction("add-one", AddOne);
    mgr.registerAction("add-two", AddTwo);
    mgr.registerAction("add-five", AddFive);
    mgr.registerAction("sub-one", SubOne);

    mgr.registerEvent(eventName, {
      name: "add-one"
    });
    mgr.registerEvent(eventName, {
      name: "add-two"
    });
    mgr.registerEvent(eventName, {
      name: "add-five"
    });
    mgr.registerEvent(eventName, {
      name: "sub-one",
    });
    let res;
    res = await mgr.emitEvent(eventName, 2);
    expect(res).toBe(9);
    res = await mgr.emitEvent(eventName, 3);
    expect(res).toBe(10);
    res = await mgr.emitEvent(eventName, 4);
    expect(res).toBe(11);
  });

  it("can take more than one argument", async () => {
    const mgr = new EventManager();
    const eventName = "testEvent";
    mgr.registerAction("add-together", AddTogether);
    mgr.registerAction("div-by-two", DivByTwo);
    mgr.registerEvent(eventName, { name: "add-together" });
    mgr.registerEvent(eventName, { name: "div-by-two" });
    let res;
    res = await mgr.emitEvent(eventName, 2, 2);
    expect(res).toBe(2);
    res = await mgr.emitEvent(eventName, 2, 6);
    expect(res).toBe(4);
  });

  it("can add custom", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-together", AddTogether);
    mgr.registerAction("add-custom", AddCustom);
    const eventName = "testEvent";
    mgr.registerEvent(eventName, {
      name: "add-together"
    });
    mgr.registerEvent(eventName, {
      name: "add-custom",
      args: 5,
    });
    mgr.registerEvent(eventName, {
      name: "add-custom",
      args: 10,
    });
    let res: number;
    res = await mgr.emitEvent(eventName, 2, 2);
    expect(res).toBe(19);
    res = await mgr.emitEvent(eventName, 1, 4);
    expect(res).toBe(20);
  });

});
