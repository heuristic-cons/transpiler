import {Hex} from "./hex";
import {ICharacter} from "./_character";
import {INumeric} from "./_numeric";
import {String} from "./string";
import {getDateFromNumber, getNumberFromDate} from "./_javascript_date";

export class Date implements ICharacter {
  private value: string;

  public constructor() {
    this.clear();
  }

  public set(value: INumeric | ICharacter | Hex | string | number) {
    if (typeof value === "number") {
      if (value <= 0 || value > 3652060) {
        this.value = "00000000";
      } else {
        this.value = getDateFromNumber(value);
      }
    } else if (typeof value === "string") {
      this.value = value;
    } else {
      this.set(value.get());
    }
    return this;
  }

  public clear(): void {
    this.value = "00000000";
  }

  public get(): string {
    return this.value;
  }

  public getNumeric(): number {
    return getNumberFromDate(this.value);
  }

  public getOffset(input: {offset: number, length: number}) {
    let ret = this.value;
    if (input?.offset) {
      ret = ret.substr(input.offset);
    }
    if (input?.length) {
      ret = ret.substr(0, input.length);
    }
    const r = new String();
    r.set(ret);
    return r;
  }
}