import {ICharacter} from "../types/_character";
import {INumeric} from "../types/_numeric";

export function ca(left: number | string | ICharacter | INumeric, right: string | ICharacter): boolean {
  let l = "";
  if (typeof left === "number" || typeof left === "string") {
    l = left.toString();
  } else {
    l = left.get().toString();
  }
  if (l === "") {
    l = " ";
  }

  let r = "";
  if (typeof right === "string") {
    r = right.toString();
  } else {
    r = right.get().toString();
  }

  const split = r.split("");

  return split.some(c => l.includes(c));
}