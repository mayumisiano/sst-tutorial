import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@sst-demo/core/todo", () => ({
  Todo: {
    create: vi.fn(),
    list: vi.fn(() => [
      { id: "1", title: "Todo #0" },
      { id: "2", title: "Todo #1" },
    ]),
  },
}));

import { create, list } from "./todo";
import { Todo } from "@sst-demo/core/todo";

describe("todo create handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls Todo.create", async () => {
    await create();
    expect(Todo.create).toHaveBeenCalledOnce();
  });

  it("returns status 200", async () => {
    const response = await create();
    expect(response.statusCode).toBe(200);
  });

  it("returns confirmation message", async () => {
    const response = await create();
    expect(response.body).toBe("Todo created");
  });
});

describe("todo list handler", () => {
  it("calls Todo.list", async () => {
    await list();
    expect(Todo.list).toHaveBeenCalledOnce();
  });

  it("returns status 200", async () => {
    const response = await list();
    expect(response.statusCode).toBe(200);
  });

  it("returns JSON array of todos", async () => {
    const response = await list();
    const body = JSON.parse(response.body);
    expect(body).toHaveLength(2);
    expect(body[0]).toEqual({ id: "1", title: "Todo #0" });
  });
});
