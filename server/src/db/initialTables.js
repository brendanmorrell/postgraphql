const user = `
  CREATE TABLE IF NOT EXISTS "user"(
      "id" serial,
      "name" text,
      PRIMARY KEY ("id")
  );
`

const todo = `
  CREATE TABLE IF NOT EXISTS "todo"(
      "id" serial,
      "task" text,
      "completed" boolean,
      PRIMARY KEY ("id")
  );
`
const userTodo = `
  CREATE TABLE IF NOT EXISTS "user_todo"(
    "id" serial,
    "userID" serial,
    "todoID" serial,
    PRIMARY KEY ("id"),
    FOREIGN KEY ("userID") REFERENCES "user" ("id"),
    UNIQUE ("userID"),
    FOREIGN KEY ("todoID") REFERENCES "todo" (id),
    UNIQUE ("todoID")
  );
`
module.exports = [todo, user, userTodo]
