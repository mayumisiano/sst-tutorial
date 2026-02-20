export * as Todo from "./todo";
import crypto from "crypto";
import { publishEvent } from "./event";

export async function create() {
  const id = crypto.randomUUID();

  await publishEvent("sst-demo", "todo.created", { id });
}

export function list() {
  return Array(50)
    .fill(0)
    .map((_, index) => ({
      id: crypto.randomUUID(),
      title: "Todo #" + index,
    }));
}
