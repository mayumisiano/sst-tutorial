/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "sst-demo",
      home: "aws",
      providers: { aws: { region: "us-east-1" } },
    };
  },
  async run() {
    const bus = new sst.aws.Bus("Bus");

    const api = new sst.aws.ApiGatewayV2("Api");
    api.route("GET /", {
      handler: "packages/functions/src/lambda.handler",
      link: [bus],
    });
    api.route("GET /todo", {
      handler: "packages/functions/src/todo.list",
      link: [bus],
    });
    api.route("POST /todo", {
      handler: "packages/functions/src/todo.create",
      link: [bus],
    });

    bus.subscribe("TodoCreated", "packages/functions/src/events/todo-created.handler");

    return { ApiEndpoint: api.url };
  },
});
