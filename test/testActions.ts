
import { ActionTypeGenerator }  from "../src/action";

import { delay }  from "../src/utils";

export const AddOne: ActionTypeGenerator = () => {
  return async (...args: any[]): Promise<any> => {
    await delay(200);
    return args[0] + 1;
  }
}

export const AddTogether: ActionTypeGenerator = () => {
  return async (...args: any[]): Promise<any> => {
    await delay(500);
    return args[0] + args[1];
  }
}

export const DivByTwo: ActionTypeGenerator =() => {
  return async (...args: any[]): Promise<any> => {
    await delay(200);
    return args[0] / 2;
  }
}

export const SubOne: ActionTypeGenerator =() => {
  return async (...args: any[]): Promise<any> => {
    await delay(300);
    return args[0] - 1;
  }
}

export const AddTwo: ActionTypeGenerator =() => {
  return async (...args: any[]): Promise<any> => {
    await delay(200);
    return args[0] + 2;
  }
}

export const AddFive: ActionTypeGenerator = () => {
  return async (...args: any[]): Promise<any> => {
    await delay(200);
    return args[0] + 5;
  }
}

export const AddCustom: ActionTypeGenerator = (amount: number) => {
  return async (...args: any[]): Promise<any> => {
    await delay(100);
    return args[0] + amount;
  }
}