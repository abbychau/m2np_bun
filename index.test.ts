import { expect, test, describe } from "bun:test";
import app from "./app";

describe("index", () => {
  test("GET /feeds", async () => {
    const res = await app.request("/feeds");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Hello World" });
  });
});
