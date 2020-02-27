import {expect} from "chai";
import * as abap from "../../src/runtime";

describe("Arithmetics", () => {
  it("Set initial value", () => {
    const foo = new abap.basictypes.I();
    const bar = new abap.basictypes.I();
    foo.set(bar);

    expect(foo).to.not.equal(undefined);
    expect(foo.get()).to.equal(0);
  });

  it("2 + 2", () => {
    const foo = new abap.basictypes.I(2);
    const bar = new abap.basictypes.I(2);
    const boo = new abap.basictypes.I(2);

    boo.set(foo.add(bar));

    expect(boo.get()).to.equal(4);
  });
});