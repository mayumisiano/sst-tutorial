import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@sst-demo/core/todo", () => {
  const todos = [
    { id: "aaa-111", title: "Todo #0" },
    { id: "bbb-222", title: "Todo #1" },
    { id: "ccc-333", title: "Todo #2" },
  ];
  return {
    Todo: {
      create: vi.fn(),
      list: vi.fn(() => todos),
    },
  };
});

import { handler as helloHandler } from "./lambda";
import { create as createHandler, list as listHandler } from "./todo";

describe("API integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /", () => {
    it("returns 200 with a text body", async () => {
      const res = await helloHandler();

      expect(res.statusCode).toBe(200);
      expect(typeof res.body).toBe("string");
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /todo", () => {
    it("returns 200 with a JSON array", async () => {
      const res = await listHandler();

      expect(res.statusCode).toBe(200);

      const body = JSON.parse(res.body);
      expect(Array.isArray(body)).toBe(true);
    });

    it("each todo has id and title", async () => {
      const res = await listHandler();
      const body = JSON.parse(res.body);

      for (const todo of body) {
        expect(todo).toHaveProperty("id");
        expect(todo).toHaveProperty("title");
      }
    });

    it("returns the expected todos", async () => {
      const res = await listHandler();
      const body = JSON.parse(res.body);

      expect(body).toEqual([
        { id: "aaa-111", title: "Todo #0" },
        { id: "bbb-222", title: "Todo #1" },
        { id: "ccc-333", title: "Todo #2" },
      ]);
    });
  });

  describe("POST /todo", () => {
    it("returns 200 with confirmation", async () => {
      const res = await createHandler();

      expect(res.statusCode).toBe(200);
      expect(res.body).toBe("Todo created");
    });

    it("triggers the create logic", async () => {
      const { Todo } = await import("@sst-demo/core/todo");

      await createHandler();

      expect(Todo.create).toHaveBeenCalledOnce();
    });
  });

  describe("response format", () => {
    it("all endpoints return statusCode and body", async () => {
      const responses = await Promise.all([
        helloHandler(),
        listHandler(),
        createHandler(),
      ]);

      for (const res of responses) {
        expect(res).toHaveProperty("statusCode");
        expect(res).toHaveProperty("body");
        expect(typeof res.statusCode).toBe("number");
        expect(typeof res.body).toBe("string");
      }
    });
  });
});
