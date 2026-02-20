import { describe, it, expect } from "vitest";
import { handler } from "./lambda";

describe("lambda handler", () => {
  it("returns status 200", async () => {
    const response = await handler();
    expect(response.statusCode).toBe(200);
  });

  it("returns a greeting in the body", async () => {
    const response = await handler();
    expect(response.body).toContain("Hello World");
  });
});
