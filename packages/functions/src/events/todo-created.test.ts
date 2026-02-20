import { describe, it, expect, vi } from "vitest";
import type { EventBridgeEvent } from "aws-lambda";
import { handler } from "./todo-created";

describe("todo-created event handler", () => {
  it("logs the event detail", async () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});

    const event = {
      detail: { id: "test-uuid-123" },
    } as EventBridgeEvent<string, { id: string }>;

    await handler(event);

    expect(spy).toHaveBeenCalledWith("Todo created", { id: "test-uuid-123" });
    spy.mockRestore();
  });
});
