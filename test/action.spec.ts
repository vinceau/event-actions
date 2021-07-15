import { EventManager, Context, ActionTypeGenerator } from "../src/action";
import { AddOne, AddTwo, AddTogether, AddFive, SubOne, DivByTwo, AddCustom, AddToContext } from "./testActions";

describe("action events", () => {

  it("correctly calculates result for a single action", async () => {
    const mgr = newEventManager();
    mgr.registerAction("add-one", AddOne);
    const eventName = "testEvent";
    mgr.registerEvent(eventName, {
      name: "add-one",
      children: [{ name: "assert" }],
    });
    await mgr.emitEvent(eventName, {
      result: 1,
      __expected__: {
        result: 2,
      },
    });
    await mgr.emitEvent(eventName, {
      result: 2,
      __expected__: {
        result: 3,
      }
    });
    await mgr.emitEvent(eventName, {
      result: 3,
      __expected__: {
        result: 4,
      }
    });
  });

  it("should return NaN if no context was given to the transforming action", async () => {
    const mgr = newEventManager();
    mgr.registerAction("add-one", AddOne);
    const eventName = "testEvent";
    mgr.registerEvent(eventName, {
      name: "add-one",
      children: [{ name: "assert" }]
    });
    await mgr.emitEvent(eventName, {
      __expected__: {
        result: NaN,
      }
    });
  });

  it("correctly chains transforming actions", async () => {
    const mgr = newEventManager();
    const eventName = "testEvent";
    mgr.registerAction("add-one", AddOne);
    mgr.registerAction("add-two", AddTwo);
    mgr.registerAction("add-five", AddFive);
    mgr.registerAction("sub-one", SubOne);

    mgr.registerEvent(eventName, {
      name: "add-one",
      children: [
        {
          name: "add-two",
          children: [
            {
              name: "add-five",
              children: [
                {
                  name: "sub-one",
                  children: [{
                    name: "assert",
                  }],
                }
              ],
            }
          ],
        }
      ],
    });
    await mgr.emitEvent(eventName, {
      result: 2,
      __expected__: {
        result: 9,
      }
    });
    await mgr.emitEvent(eventName, {
      result: 3,
      __expected__: {
        result: 10,
      }
    });
    await mgr.emitEvent(eventName, {
      result: 4,
      __expected__: {
        result: 11,
      }
    });
  });

  it("can take more than one argument", async () => {
    const mgr = newEventManager();
    const eventName = "testEvent";
    mgr.registerAction("add-together", AddTogether);
    mgr.registerAction("div-by-two", DivByTwo);
    mgr.registerEvent(eventName, {
      name: "add-together",
      children: [{
        name: "div-by-two",
        children: [{ name: "assert" }]
      }],
    });
    await mgr.emitEvent(eventName, {
      result: [2, 2],
      __expected__: {
        result: 2,
      }
    });
    await mgr.emitEvent(eventName, {
      result: [2, 6],
      __expected__: {
        result: 4,
      },
    });
  });

  it("can add custom", async () => {
    const mgr = newEventManager();
    mgr.registerAction("add-together", AddTogether);
    mgr.registerAction("add-custom", AddCustom);
    const eventName = "testEvent";
    mgr.registerEvent(eventName, {
      name: "add-together",
      children: [{
        name: "add-custom",
        args: 5,
        children: [{
          name: "add-custom",
          args: 10,
          children: [{ name: "assert" }],
        }],
      }]
    });
    await mgr.emitEvent(eventName, {
      result: [2, 2],
      __expected__: {
        result: 19,
      },
    });
    await mgr.emitEvent(eventName, {
      result: [1, 4],
      __expected__: {
        result: 20,
      },
    });
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

  it("can deserialize event actions", async () => {
    const mgr = newEventManager();
    mgr.registerAction("add-together", AddTogether);
    mgr.registerAction("add-custom", AddCustom);
    const eventName = "testEvent";
    const jsonString = `{"testEvent":[{"name":"add-together","children":[{"name":"add-custom","args":5,"children":[{"name":"add-custom","args":10,"children":[{"name":"assert"}]}]}]}]}`;
    mgr.deserialize(jsonString);
    await mgr.emitEvent(eventName, {
      result: [2, 2],
      __expected__: {
        result: 19,
      },
    });
    await mgr.emitEvent(eventName, {
      result: [1, 4],
      __expected__: {
        result: 20,
      },
    });
  });

  it("can write things to the context", async () => {
    const mgr = new EventManager();
    mgr.registerAction("add-context", AddToContext);
    const eventName = "testEvent";
    mgr.registerEvent(eventName, {
      name: "add-context",
      args: 123,
      children: [{"name": "assert"}],
    });
    const beforeContext: Context = {
      foo: "bar",
      __expected__: {
        foo: "bar",
        aded: 123,
      },
    };
    await mgr.emitEvent(eventName, beforeContext);
  });

});

const newEventManager = (): EventManager => {
  const mgr = new EventManager();
  mgr.registerAction("assert", AssertContext);
  return mgr;
};

/*
Asserts that a particular context exists
*/
const AssertContext: ActionTypeGenerator = () => {
  return async (ctx: Context): Promise<Context> => {
    const contextToCompare = ctx["__expected__"];
    expect(contextToCompare).toBeDefined();
    const contextKeys = Object.keys(contextToCompare);
    expect(contextKeys.length).toBeGreaterThan(0);
    for (const key of contextKeys) {
      expect(ctx[key]).toEqual(contextToCompare[key]);
    }
    return ctx;
  }
}