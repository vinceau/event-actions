
import { ActionTypeGenerator, Context }  from "../src/action";

import { delay }  from "../src/utils";

/*
A transforming action. Takes the result of the last action
and adds one to it.
*/
export const TAddOne: ActionTypeGenerator = () => {
  return async (ctx: Context): Promise<Context> => {
    await delay(200);
    return {
      ...ctx,
      result: ctx.result + 1,
    };
  }
}

/*
Adds the first two items of the result together.
Result is assumed to be a list.
*/
export const TAddTogether: ActionTypeGenerator = () => {
  return async (ctx: Context): Promise<Context> => {
    await delay(500);
    return {
      ...ctx,
      result: ctx.result[0] + ctx.result[1],
    };
  }
}

/*
A transforming action that takes the result and divides it by two
*/
export const TDivByTwo: ActionTypeGenerator = () => {
  return async (ctx: Context): Promise<Context> => {
    await delay(200);
    return {
      ...ctx,
      result: ctx.result / 2,
    };
  }
}

export const TSubOne: ActionTypeGenerator = () => {
  return async (ctx: Context): Promise<Context> => {
    await delay(300);
    return {
      ...ctx,
      result: ctx.result - 1
    };
  }
}

export const TAddTwo: ActionTypeGenerator = () => {
  return async (ctx: Context): Promise<Context> => {
    await delay(200);
    return {
      ...ctx,
      result: ctx.result + 2
    };
  }
}

export const TAddFive: ActionTypeGenerator = () => {
  return async (ctx: Context): Promise<Context> => {
    await delay(200);
    return {
      ...ctx,
      result: ctx.result + 5,
    };
  }
}

/*
A transforming action that adds a custom number to the result.
*/
export const TAddCustom: ActionTypeGenerator = (amount: number) => {
  return async (ctx: Context): Promise<Context> => {
    await delay(100);
    return {
      ...ctx,
      result: ctx.result + amount,
    };
  }
}