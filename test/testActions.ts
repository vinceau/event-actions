
import { Action }  from "../src/action";

import { delay }  from "../src/utils";

export class AddOne implements Action {
  public async run(...args: any[]): Promise<any> {
    await delay(1000);
    return args[0] + 1;
  }
}

export class SubOne implements Action {
  public async run(...args: any[]): Promise<any> {
    await delay(1000);
    return args[0] - 1;
  }
}

export class AddTwo implements Action {
  public async run(...args: any[]): Promise<any> {
    await delay(1000);
    return args[0] + 2;
  }
}

export class AddFive implements Action {
  public async run(...args: any[]): Promise<any> {
    await delay(1000);
    return args[0] + 5;
  }
}