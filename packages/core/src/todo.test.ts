import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./event", () => ({
  publishEvent: vi.fn(),
}));

import { list, create } from "./todo";
import { publishEvent } from "./event";

describe("Todo.list", () => {
  it("returns 50 items", () => {
    const todos = list();
    expect(todos).toHaveLength(50);
  });

  it("each item has id and title", () => {
    const todos = list();
    for (const todo of todos) {
      expect(todo).toHaveProperty("id");
      expect(todo).toHaveProperty("title");
      expect(typeof todo.id).toBe("string");
      expect(typeof todo.title).toBe("string");
    }
  });

  it("titles are sequential", () => {
    const todos = list();
    expect(todos[0].title).toBe("Todo #0");
    expect(todos[49].title).toBe("Todo #49");
  });

  it("ids are unique UUIDs", () => {
    const todos = list();
    const ids = new Set(todos.map((t) => t.id));
    expect(ids.size).toBe(50);
  });
});

describe("Todo.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("publishes a todo.created event", async () => {
    await create();

    expect(publishEvent).toHaveBeenCalledOnce();
    expect(publishEvent).toHaveBeenCalledWith(
      "sst-demo",
      "todo.created",
      expect.objectContaining({ id: expect.any(String) })
    );
  });

  it("generates a unique id each time", async () => {
    await create();
    await create();

    const calls = vi.mocked(publishEvent).mock.calls;
    const id1 = (calls[0][2] as { id: string }).id;
    const id2 = (calls[1][2] as { id: string }).id;
    expect(id1).not.toBe(id2);
  });
});
