
import { Action }  from "../src/action";

import { delay }  from "../src/utils";

export class AddOne implements Action {
  public async run(...args: any[]): Promise<any> {
    await delay(200);
    return args[0] + 1;
  }
}

export class AddTogether implements Action {
  public async run(...args: any[]): Promise<any> {
    await delay(500);
    return args[0] + args[1];
  }
}

export class DivByTwo implements Action {
  public async run(...args: any[]): Promise<any> {
    await delay(200);
    return args[0] / 2;
  }
}

export class SubOne implements Action {
  public async run(...args: any[]): Promise<any> {
    await delay(300);
    return args[0] - 1;
  }
}

export class AddTwo implements Action {
  public async run(...args: any[]): Promise<any> {
    await delay(200);
    return args[0] + 2;
  }
}

export class AddFive implements Action {
  public async run(...args: any[]): Promise<any> {
    await delay(200);
    return args[0] + 5;
  }
}

export class AddCustom implements Action {
  private amount: number;

  public constructor(amount: number) {
    this.amount = amount;
  }

  public async run(...args: any[]): Promise<any> {
    await delay(100);
    return args[0] + this.amount;
  }
}