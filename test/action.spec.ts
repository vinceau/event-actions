import { EventManager } from "../src/action";
import { TAddOne, TAddTwo, AddTogether, TAddFive, TSubOne, DivByTwo, AddCustom } from "./testActions";

describe("action events", () => {

  it("correctly calculates result for a single action", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-one", TAddOne);
    const eventName = "testEvent";
    mgr.registerEvent(eventName, {
      name: "add-one",
    });
    let res: number;
    res = await mgr.emitEvent(eventName, {
      result: 1,
    });
    expect(res).toBe(2);
    res = await mgr.emitEvent(eventName, {
      result: 2
    });
    expect(res).toBe(3);
    res = await mgr.emitEvent(eventName, {
      result: 3
    });
    expect(res).toBe(4);
  });

  it("should return NaN if no context was given to the transforming action", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-one", TAddOne);
    const eventName = "testEvent";
    mgr.registerEvent(eventName, {
      name: "add-one",
    });
    const res: number = await mgr.emitEvent(eventName, {});
    expect(res).toBeNaN();
  });

  it("correctly chains transforming actions", async () => {
    const mgr = new EventManager();
    const eventName = "testEvent";
    mgr.registerAction("add-one", TAddOne);
    mgr.registerAction("add-two", TAddTwo);
    mgr.registerAction("add-five", TAddFive);
    mgr.registerAction("sub-one", TSubOne);

    mgr.registerEvent(eventName, {
      name: "add-one",
    });
    mgr.registerEvent(eventName, {
      name: "add-two",
    });
    mgr.registerEvent(eventName, {
      name: "add-five",
    });
    mgr.registerEvent(eventName, {
      name: "sub-one",
    });
    let res;
    res = await mgr.emitEvent(eventName, {
      result: 2,
    });
    expect(res).toBe(9);
    res = await mgr.emitEvent(eventName, {
      result: 3,
    });
    expect(res).toBe(10);
    res = await mgr.emitEvent(eventName, {
      result: 4,
    });
    expect(res).toBe(11);
  });

  /*
  it("can take more than one argument", async () => {
    const mgr = new EventManager();
    const eventName = "testEvent";
    mgr.registerAction("add-together", AddTogether);
    mgr.registerAction("div-by-two", DivByTwo);
    mgr.registerEvent(eventName, {
      name: "add-together",
    });
    mgr.registerEvent(eventName, {
      name: "div-by-two",
    });
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
      name: "add-together",
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

  it("can execute arbitrary actions", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-together", AddTogether);
    mgr.registerAction("add-custom", AddCustom);
    const actionsList = [
      {
        name: "add-together",
      },
      {
        name: "add-custom",
        args: 5,
      },
      {
        name: "add-custom",
        args: 10,
      }
    ];
    let res: number;
    res = await mgr.execute(actionsList, 2, 2);
    expect(res).toBe(19);
    res = await mgr.execute(actionsList, 1, 4);
    expect(res).toBe(20);
  });

  it("cannot remove non-existent actions", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-together", AddTogether);
    mgr.registerAction("add-custom", AddCustom);
    const eventName = "testEvent";
    expect(mgr.removeEventAction(eventName, 1)).toBe(false)
    mgr.registerEvent(eventName, {
      name: "add-together",
    });
    expect(mgr.removeEventAction(eventName, 1)).toBe(false)
    mgr.registerEvent(eventName, {
      name: "add-custom",
      args: 5,
    });
    expect(mgr.removeEventAction(eventName, 1)).toBe(true)
  });

  it("can remove actions", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-together", AddTogether);
    mgr.registerAction("add-custom", AddCustom);
    const eventName = "testEvent";
    mgr.registerEvent(eventName, {
      name: "add-together",
    });
    mgr.registerEvent(eventName, {
      name: "add-custom",
      args: 5,
    });
    mgr.registerEvent(eventName, {
      name: "add-custom",
      args: 10,
    });
    expect(mgr.removeEventAction(eventName, 2)).toBe(true)
    let res: number;
    res = await mgr.emitEvent(eventName, 2, 2);
    expect(res).toBe(9);
    res = await mgr.emitEvent(eventName, 1, 4);
    expect(res).toBe(10);
  });

  it("can deserialize event actions", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-together", AddTogether);
    mgr.registerAction("add-custom", AddCustom);
    const eventName = "testEvent";
    const jsonString = `{"testEvent":[{"name":"add-together","transform":true},{"name":"add-custom","transform":true,"args":5},{"name":"add-custom","transform":true,"args":10}]}`;
    mgr.deserialize(jsonString);
    let res: number;
    res = await mgr.emitEvent(eventName, 2, 2);
    expect(res).toBe(19);
    res = await mgr.emitEvent(eventName, 1, 4);
    expect(res).toBe(20);
  });
  */

});
