import "@testing-library/jest-dom";
import { TextSearch } from "./find-in-text";

const textSearch = new TextSearch("lunr");

describe("find in text line 2", () => {
  it("find line, long", () => {
    const res = textSearch.findInText(
      "principalmente derivados de granos de cereales, mayor parte cebada malteada, y trigo"
    );
    expect(res).toBe(2);
  });
  it("find line, medium", () => {
    const res = textSearch.findInText(
      "principalmente derivados de granos de cereales"
    );
    expect(res).toBe(2);
  });
  it("find line, short", () => {
    const res = textSearch.findInText("principalmente derivados");
    expect(res).toBe(2);
  });
});

describe("find in text line 29", () => {
  it("find line, long", () => {
    const res = textSearch.findInText(
      "la cerveza es una de las bebidas alcohólicas, de las más antiguas del mundo",
      0,
      70
    );
    expect(res).toBe(29);
  });
  it("find line, medium", () => {
    const res = textSearch.findInText("una de las bebidas mas antiguas", 0, 70);
    expect(res).toBe(29);
  });
  it("find line, short", () => {
    const res = textSearch.findInText("bebidas preparadas", 0, 70);

    expect(res).toBe(29);
  });
});

describe("find in text line 254", () => {
  it("find line, long", () => {
    const res = textSearch.findInText(
      "Las cervezas lager y pale ale estan elaboradas con malta secada",
      200,
      70
    );
    expect(res).toBe(254);
  });
  it("find line, medium", () => {
    const res = textSearch.findInText(
      "Pale lager y pale ale suelen estar elaboradas con malta",
      200,
      70
    );
    expect(res).toBe(254);
  });
  it("find line, short", () => {
    const res = textSearch.findInText("elaboradas con malta secada", 200, 70);

    expect(res).toBe(254);
  });
});
