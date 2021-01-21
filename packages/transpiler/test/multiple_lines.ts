/* eslint-disable max-len */
import {expect} from "chai";
import {runSingle} from "./_utils";

describe("Multiple lines", () => {

  it("IF + ELSEIF + ELSE", async () => {
    const abap = `
    IF foo = bar.
    write moo.
    ELSEIF moo = boo.
    ELSE.
    ENDIF.`;

    const expected =
`if (abap.compare.eq(foo, bar)) {
  abap.statements.write(moo);
} else if (abap.compare.eq(moo, boo)) {
} else {
}`;

    expect(await runSingle(abap, {ignoreSyntaxCheck: true})).to.equal(expected);
  });

  it("Interfaces should not be skipped", async () => {
    const abap = `
  INTERFACE lif_foobar.
  ENDINTERFACE.`;

    expect(await runSingle(abap)).to.equal(`class lif_foobar {
}`);
  });

  it("TYPES should be skipped", async () => {
    const abap = `
    TYPES: BEGIN OF ty_header,
    field TYPE string,
    value TYPE string,
  END OF ty_header.`;

    expect(await runSingle(abap)).to.equal("");
  });

  it("Simple class, 1", async () => {
    const abap = `
    CLASS lcl_foobar DEFINITION.
      PUBLIC SECTION.
        METHODS: moo.
    ENDCLASS.

    CLASS lcl_foobar IMPLEMENTATION.
      METHOD moo.
      ENDMETHOD.
    ENDCLASS.`;

    const expected =
`class lcl_foobar {
  async constructor_() {
    this.me = new abap.types.ABAPObject();
    this.me.set(this);
    return this;
  }
  async moo() {
  }
}`;

    expect(await runSingle(abap)).to.equal(expected);
  });

  it("Simple class, with input parameter", async () => {
    const abap = `
    CLASS lcl_foobar DEFINITION.
      PUBLIC SECTION.
        METHODS: moo
          IMPORTING iv_foo TYPE string.
    ENDCLASS.

    CLASS lcl_foobar IMPLEMENTATION.
      METHOD moo.
      ENDMETHOD.
    ENDCLASS.`;

    const expected =
`class lcl_foobar {
  async constructor_() {
    this.me = new abap.types.ABAPObject();
    this.me.set(this);
    return this;
  }
  async moo(unique1) {
    let iv_foo = new abap.types.String();
    if (unique1 && unique1.iv_foo) {iv_foo.set(unique1.iv_foo);}
  }
}`;

    expect(await runSingle(abap)).to.equal(expected);
  });

  it("Simple class, with return parameter", async () => {
    const abap = `
    CLASS lcl_foobar DEFINITION.
      PUBLIC SECTION.
        METHODS: moo
          RETURNING VALUE(rv_foo) TYPE string.
    ENDCLASS.

    CLASS lcl_foobar IMPLEMENTATION.
      METHOD moo.
      ENDMETHOD.
    ENDCLASS.`;

    const expected =
`class lcl_foobar {
  async constructor_() {
    this.me = new abap.types.ABAPObject();
    this.me.set(this);
    return this;
  }
  async moo() {
    let rv_foo = new abap.types.String();
    return rv_foo;
  }
}`;

    expect(await runSingle(abap)).to.equal(expected);
  });

  it("CASE", async () => {
    const abap = `
CASE bar.
WHEN 'foo'.
WRITE 2.
WHEN 1 OR 2.
WHEN foo.
WHEN OTHERS.
ENDCASE.`;

    const expected =
`const constant_1 = new abap.types.Integer().set(1);
const constant_2 = new abap.types.Integer().set(2);
let unique1 = bar;
if (abap.compare.eq(unique1, 'foo')) {
  abap.statements.write(constant_2);
} else if (abap.compare.eq(unique1, constant_1) || abap.compare.eq(unique1, constant_2)) {
} else if (abap.compare.eq(unique1, foo)) {
} else {
}`;

    expect(await runSingle(abap, {ignoreSyntaxCheck: true})).to.equal(expected);
  });

  it("REF TO object", async () => {
    const abap = `
CLASS zcl_words DEFINITION.
ENDCLASS.
CLASS zcl_words IMPLEMENTATION.
ENDCLASS.
DATA foo TYPE REF TO zcl_words.
CREATE OBJECT foo.`;

    const expected =
`class zcl_words {
  async constructor_() {
    this.me = new abap.types.ABAPObject();
    this.me.set(this);
    return this;
  }
}
let foo = new abap.types.ABAPObject();
foo.set(await (new zcl_words()).constructor_());`;

    expect(await runSingle(abap)).to.equal(expected);
  });

  it("Locally defined structure", async () => {
    const abap = `
  TYPES: BEGIN OF foo,
  bar TYPE c,
END OF foo.
DATA moo TYPE foo.`;

    const expected = `let moo = new abap.types.Structure({bar: new abap.types.Character()});`;

    expect(await runSingle(abap)).to.equal(expected);
  });

  it("Class attribute", async () => {
    const abap = `
      CLASS zcl_words DEFINITION.
        PUBLIC SECTION.
          DATA bar TYPE i.
          METHODS: run.
      ENDCLASS.
      CLASS zcl_words IMPLEMENTATION.
        METHOD run.
          WRITE bar.
        ENDMETHOD.
      ENDCLASS.`;

    const expected = `class zcl_words {
  async constructor_() {
    this.me = new abap.types.ABAPObject();
    this.me.set(this);
    this.bar = new abap.types.Integer();
    return this;
  }
  async run() {
    abap.statements.write(this.bar);
  }
}`;

    expect(await runSingle(abap)).to.equal(expected);
  });

  it("Class constructor1", async () => {
    const abap = `
      CLASS zcl_words DEFINITION.
        PUBLIC SECTION.
          DATA bar TYPE i.
          METHODS: constructor.
      ENDCLASS.

      CLASS zcl_words IMPLEMENTATION.
        METHOD constructor.
          bar = 2.
          WRITE bar.
        ENDMETHOD.
      ENDCLASS.`;

    const expected = `const constant_2 = new abap.types.Integer().set(2);
class zcl_words {
  async constructor_(unique1) {
    this.me = new abap.types.ABAPObject();
    this.me.set(this);
    this.bar = new abap.types.Integer();
    this.bar.set(constant_2);
    abap.statements.write(this.bar);
    return this;
  }
}`;

    expect(await runSingle(abap)).to.equal(expected);
  });

  it("Class constructor2", async () => {
    const abap = `
CLASS zcl_ret DEFINITION.
  PUBLIC SECTION.
    DATA bar TYPE i.
    CLASS-METHODS:
      run RETURNING VALUE(rv_ret) TYPE string.
ENDCLASS.

CLASS zcl_ret IMPLEMENTATION.
  METHOD run.
    rv_ret = 'X'.
  ENDMETHOD.
ENDCLASS.`;

    const expected = `class zcl_ret {
  async constructor_() {
    this.me = new abap.types.ABAPObject();
    this.me.set(this);
    this.bar = new abap.types.Integer();
    return this;
  }
  async run() {
    return zcl_ret.run();
  }
  static async run() {
    let rv_ret = new abap.types.String();
    rv_ret.set('X');
    return rv_ret;
  }
}`;

    expect(await runSingle(abap)).to.equal(expected);
  });

  it("TRY, CATCH", async () => {
    const abap = `
TRY.
CATCH cx_root.
ENDTRY.`;

    const expected =
`try {
} catch (e) {
  if (!(e instanceof cx_root)) {
    throw e;
  }
}`;

    expect(await runSingle(abap, {ignoreSyntaxCheck: true})).to.equal(expected);
  });

  it("DO. ENDDO.", async () => {
    const abap = `
DO.
ENDDO.`;

    const expected =
`let unique1 = 1;
while (true) {
  abap.builtin.sy.get().index.set(unique1++);
}`;

    expect(await runSingle(abap, {ignoreSyntaxCheck: true})).to.equal(expected);
  });

  it("Class constant, should set value", async () => {
    const abap = `
CLASS zcl_ret DEFINITION.
  PRIVATE SECTION.
    CONSTANTS: c_maxdcodes TYPE i VALUE 30.
ENDCLASS.

CLASS zcl_ret IMPLEMENTATION.
ENDCLASS.`;

    const expected = `const constant_30 = new abap.types.Integer().set(30);
class zcl_ret {
  async constructor_() {
    this.me = new abap.types.ABAPObject();
    this.me.set(this);
    return this;
  }
}
zcl_ret.c_maxdcodes = new abap.types.Integer();
zcl_ret.c_maxdcodes.set(30);`;

    expect(await runSingle(abap)).to.equal(expected);
  });

  it("Class static data", async () => {
    const abap = `
CLASS lcl_bar DEFINITION.
  PUBLIC SECTION.
    CLASS-DATA foo TYPE i.
ENDCLASS.
CLASS lcl_bar IMPLEMENTATION.
ENDCLASS.`;

    const expected = `class lcl_bar {
  async constructor_() {
    this.me = new abap.types.ABAPObject();
    this.me.set(this);
    return this;
  }
}
lcl_bar.foo = new abap.types.Integer();`;

    expect(await runSingle(abap)).to.equal(expected);
  });

  it("method call", async () => {
    const abap = `
INTERFACE lif_bar.
  METHODS moo IMPORTING foo TYPE string EXPORTING bar TYPE string.
ENDINTERFACE.
DATA bar TYPE REF TO lif_bar.
DATA str TYPE string.
bar->moo( EXPORTING foo = 'abc'
          IMPORTING bar = str ).`;

    const expected = `class lif_bar {
}
let bar = new abap.types.ABAPObject();
let str = new abap.types.String();
await bar.get().moo({foo: 'abc', bar: str});`;

    expect(await runSingle(abap)).to.equal(expected);
  });

  it("method call, add default parameter name", async () => {
    const abap = `
CLASS lcl_bar DEFINITION.
  PUBLIC SECTION.
    CLASS-METHODS bar IMPORTING imp TYPE i.
ENDCLASS.
CLASS lcl_bar IMPLEMENTATION.
  METHOD bar.
  ENDMETHOD.
ENDCLASS.

FORM bar.
  lcl_bar=>bar( 2 ).
ENDFORM.`;

    const expected = `const constant_2 = new abap.types.Integer().set(2);
class lcl_bar {
  async constructor_() {
    this.me = new abap.types.ABAPObject();
    this.me.set(this);
    return this;
  }
  async bar(unique1) {
    return lcl_bar.bar(unique1);
  }
  static async bar(unique1) {
    let imp = new abap.types.Integer();
    if (unique1 && unique1.imp) {imp.set(unique1.imp);}
  }
}
async function bar() {
  await lcl_bar.bar({imp: constant_2});
}`;

    expect(await runSingle(abap)).to.equal(expected);
  });

  it("constructor with parameter", async () => {
    const abap = `
CLASS lcl_bar DEFINITION.
  PUBLIC SECTION.
    METHODS constructor IMPORTING input TYPE i.
ENDCLASS.
CLASS lcl_bar IMPLEMENTATION.
  METHOD constructor.
    WRITE input.
  ENDMETHOD.
ENDCLASS.

FORM bar.
  DATA bar TYPE REF TO lcl_bar.
  CREATE OBJECT bar EXPORTING input = 42.
ENDFORM.`;

    const expected = `const constant_42 = new abap.types.Integer().set(42);
class lcl_bar {
  async constructor_(unique1) {
    this.me = new abap.types.ABAPObject();
    this.me.set(this);
    let input = new abap.types.Integer();
    if (unique1 && unique1.input) {input.set(unique1.input);}
    abap.statements.write(input);
    return this;
  }
}
async function bar() {
  let bar = new abap.types.ABAPObject();
  bar.set(await (new lcl_bar()).constructor_({input: constant_42}));
}`;

    expect(await runSingle(abap)).to.equal(expected);
  });

  it("FIND REGEX", async () => {
    const abap = `
    DATA lv_offset TYPE i.
    DATA lv_length TYPE i.
    DATA lv_line TYPE string.
    DATA lv_count TYPE string.
    DATA lv_color TYPE string.
    FIND REGEX 'abc' IN lv_line MATCH OFFSET lv_offset MATCH LENGTH lv_length SUBMATCHES lv_count lv_color.`;
    const expected = `let lv_offset = new abap.types.Integer();
let lv_length = new abap.types.Integer();
let lv_line = new abap.types.String();
let lv_count = new abap.types.String();
let lv_color = new abap.types.String();
abap.statements.find(lv_line, {regex: 'abc', offset: lv_offset, length: lv_length, submatches: [lv_count,lv_color]});`;
    expect(await runSingle(abap)).to.equal(expected);
  });

  it("Escape class constants", async () => {
    const abap = `
  CLASS lcl_bar DEFINITION.
    PUBLIC SECTION.
      CONSTANTS foo TYPE string VALUE ''''.
  ENDCLASS.
  CLASS lcl_bar IMPLEMENTATION.
  ENDCLASS.`;
    const expected = `class lcl_bar {
  async constructor_() {
    this.me = new abap.types.ABAPObject();
    this.me.set(this);
    return this;
  }
}
lcl_bar.foo = new abap.types.String();
lcl_bar.foo.set('\\'');`;
    expect(await runSingle(abap)).to.equal(expected);
  });

});