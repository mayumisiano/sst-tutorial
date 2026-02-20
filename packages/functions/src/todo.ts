import { Todo } from "@sst-demo/core/todo";

export const create = async () => {
  await Todo.create();

  return {
    statusCode: 200,
    body: "Todo created",
  };
};

export const list = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(Todo.list()),
  };
};
