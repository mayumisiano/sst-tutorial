# SST Demo

Serverless API built with [SST v3](https://sst.dev) (Ion) on AWS. Creates an API Gateway with Todo routes and an EventBus that reacts to creation events.

## Architecture

```
API Gateway (ApiGatewayV2)
  GET  /        -> lambda.handler       (hello world)
  GET  /todo    -> todo.list            (lists 50 todos)
  POST /todo    -> todo.create          (creates todo + publishes event)

EventBridge (Bus)
  todo.created  -> todo-created.handler (logs the event)
```

## Project structure

```
sst.config.ts              # Resource definitions (API, Bus)
packages/
  core/src/
    todo.ts                # Business logic (create, list)
    event.ts               # Publishes events to EventBridge
  functions/src/
    lambda.ts              # Handler for GET /
    todo.ts                # Handlers for GET /todo and POST /todo
    events/
      todo-created.ts      # Subscriber for the todo.created event
```

## Prerequisites

- Node.js >= 18
- AWS CLI configured (`aws configure`)
- [SST CLI](https://sst.dev/docs/reference/cli/)

## Setup

```bash
npm install
```

## Development

```bash
npx sst dev
```

Deploys the infrastructure to AWS in dev mode with live reload for Lambda functions

## Deploy

```bash
npx sst deploy --stage production
```

## Tests

```bash
npm test
```

Runs unit tests for both packages (`core` and `functions`) with vitest. No AWS credentials needed.

To test the live API with Postman, Apidog, or any HTTP client, see the [Manual Testing Guide](docs/manual-testing.md).

## Teardown

```bash
npx sst remove
```

Removes all AWS resources created by SST.
