# Manual Testing Guide

How to test the API endpoints using Postman, Apidog, Insomnia, or any HTTP client

## 1. Start the API

```bash
npx sst dev
```

Wait for the deploy to finish. At the end of the output you'll see something like:

```
ApiEndpoint: https://abc123xyz.execute-api.us-east-1.amazonaws.com
```

Copy that URL, you'll use it as the base for all requests.

## 2. Create the requests

| Method | Path    | Description                       |
|--------|---------|-----------------------------------|
| GET    | `/`     | Returns a hello world message     |
| GET    | `/todo` | Returns a JSON array of 50 todos  |
| POST   | `/todo` | Creates a todo and fires an event |

No auth, no headers, no body needed. All endpoints are open.

## 3. Expected responses

### GET /

```
Hello World!
```

### GET /todo

```json
[
  { "id": "a1b2c3d4-...", "title": "Todo #0" },
  { "id": "e5f6a7b8-...", "title": "Todo #1" },
  { "id": "c9d0e1f2-...", "title": "Todo #2" },
  ...
]
```

Returns 50 items, each `id` is a random UUID

### POST /todo

```
Todo created
```

This also publishes a `todo.created` event to EventBridge. You can check the Lambda logs in the `sst dev` terminal to see the subscriber pick it up:

```
Todo created { id: "generated-uuid-here" }
```

## 4. Cleanup

When you're done testing:

```bash
npx sst remove
```

This tears down all AWS resources so you don't get charged
