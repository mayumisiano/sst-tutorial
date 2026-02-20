import type { EventBridgeEvent } from "aws-lambda";

export const handler = async (evt: EventBridgeEvent<string, { id: string }>) => {
  console.log("Todo created", evt.detail);
};
