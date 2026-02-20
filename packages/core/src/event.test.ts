import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSend = vi.hoisted(() => vi.fn());
const mockCommandCalls = vi.hoisted(() => [] as unknown[][]);

vi.mock("@aws-sdk/client-eventbridge", () => ({
  EventBridgeClient: class {
    send = mockSend;
  },
  PutEventsCommand: class {
    input: unknown;
    constructor(input: unknown) {
      this.input = input;
      mockCommandCalls.push([input]);
    }
  },
}));

vi.mock("sst", () => ({
  Resource: {
    Bus: { name: "test-bus-name" },
  },
}));

import { publishEvent } from "./event";

describe("publishEvent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCommandCalls.length = 0;
  });

  it("sends a command to EventBridge", async () => {
    await publishEvent("my-source", "my-detail-type", { key: "value" });

    expect(mockSend).toHaveBeenCalledOnce();
  });

  it("uses the correct bus name from SST Resource", async () => {
    await publishEvent("src", "type", { foo: "bar" });

    expect(mockCommandCalls[0][0]).toEqual(
      expect.objectContaining({
        Entries: [expect.objectContaining({ EventBusName: "test-bus-name" })],
      })
    );
  });

  it("passes source, detail type, and serialized detail", async () => {
    await publishEvent("app", "todo.created", { id: "abc-123" });

    expect(mockCommandCalls[0][0]).toEqual({
      Entries: [
        {
          EventBusName: "test-bus-name",
          Source: "app",
          DetailType: "todo.created",
          Detail: JSON.stringify({ id: "abc-123" }),
        },
      ],
    });
  });
});
