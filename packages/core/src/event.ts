import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { Resource } from "sst";

const client = new EventBridgeClient({});

export async function publishEvent(source: string, detailType: string, detail: Record<string, unknown>) {
  await client.send(
    new PutEventsCommand({
      Entries: [
        {
          EventBusName: Resource.Bus.name,
          Source: source,
          DetailType: detailType,
          Detail: JSON.stringify(detail),
        },
      ],
    })
  );
}
