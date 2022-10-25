import { Router } from "https://deno.land/x/oak/mod.ts";
import { getDB } from "../helpers/db_client.ts";
import { Bson } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

const router = new Router();

interface Todo {
  id?: string;
  text: string;
}

let todos: Todo[] = [];

router.get("/todos", async (ctx) => {
  const db = getDB();
  const todos = await db.collection("todos").find().toArray();
  const transformedTodos = todos.map((todo) => {
    return {
      id: todo._id.toString(),
      text: todo.text,
    };
  });
  ctx.response.body = { todos: transformedTodos };
});

router.post("/todos", async (ctx) => {
  // Get the value for the text property from the request body
  const data = await ctx.request.body().value;
  const newTodo: Todo = {
    // id: new Date().toISOString(),
    text: data.text,
  };
  // todos.push(newTodo);
  // ctx.response.body = { message: "Created the todo.", todo: newTodo };
  const db = getDB();
  const id = await db.collection("todos").insertOne(newTodo);
  ctx.response.body = { message: "Created the todo.", todo: newTodo };
});

router.put("/todos/:todoId", async (ctx) => {
  const tid = ctx.params.todoId;
  const data = await ctx.request.body().value;
  // Convert text ID to mongo ID without using $oid
  // const todoIndex = todos.findIndex((todo) => {
  //   return todo.id === tid;
  // });
  // todos[todoIndex] = { id: todos[todoIndex].id, text: data.text };
  // ctx.response.body = { message: "Updated todo" };
  const db = getDB();
  // Convert tid to mongo ID using Bson
  const todoId = new Bson.ObjectId(tid);
  const updatedTodo = await db
    .collection("todos")
    .updateOne({ _id: todoId }, { $set: { text: data.text } });

  ctx.response.body = { message: "Updated todo", todo: updatedTodo };
});

router.delete("/todos/:todoId", (ctx) => {
  const tid = ctx.params.todoId;
  // todos = todos.filter((todo) => todo.id !== tid);
  // ctx.response.body = { message: "Deleted todo" };
  const db = getDB();
  // Convert tid to mongo ID using Bson
  const todoId = new Bson.ObjectId(tid);
  const deletedTodo = db.collection("todos").deleteOne({ _id: todoId });
  ctx.response.body = { message: "Deleted todo", todo: deletedTodo };
});

export default router;
