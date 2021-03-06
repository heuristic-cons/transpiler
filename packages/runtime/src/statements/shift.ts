import {ICharacter} from "../types/_character";
import {INumeric} from "../types/_numeric";

export interface IShiftOptions {
  deletingLeading?: string | ICharacter,
  places?: INumeric,
  to?: ICharacter | string,
  direction?: "LEFT" | "RIGHT",
}

export function shift(target: ICharacter, options?: IShiftOptions) {
  if (options?.direction === "RIGHT") {
    throw "SHIFT, RIGHT todo";
  }

  let value = target.get();

  if (options?.deletingLeading) {
    let leading = options.deletingLeading;
    if (typeof leading !== "string") {
      leading = leading.get();
    }
    const split = leading.split("");
    while(split.some(s => value.substr(0, 1) === s)) {
      value = value.substr(1);
    }
  } else if (options?.places) {
    const p = options.places.get();
    value = value.substr(p);
  } else if (options?.to) {
    let to = "";
    if (typeof options.to === "string") {
      to = options.to;
    } else {
      to = options.to.get();
    }

    const index = value.search(to);
    if (index > 0) {
      value = value.substr(index);
    }
  }

  target.set(value);

}