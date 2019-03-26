require('dotenv').config()
const express = require('express')
const cors = require('cors')
const graphqlHTTP = require('express-graphql')
const gql = require('graphql-tag')
const { buildASTSchema } = require('graphql')
const { Pool } = require('pg')

const schema = buildASTSchema(gql`
  type Query {
    todos: [Todo]!
    todo(id: ID!): Todo
    users: [User]!
    userTodos(id: ID!): [Todo]!
    todoUsers(id: ID!): [User]!
  }

  type Todo {
    id: ID!
    task: String!
    completed: Boolean!
  }

  type User {
    id: ID!
    name: String
  }

  type Mutation {
    addTodo(input: TodoInput!): Todo
    editTodo(input: TodoInput!): Todo
    deleteTodo(id: ID): Todo

    addUser(input: UserInput!): User
    editUser(inpout: UserInput!): User
    deleteUser(id: ID!): User
  }

  input TodoInput {
    id: ID
    task: String
    completed: Boolean
  }
  input UserInput {
    id: ID
    name: String
  }
`)

const app = express()
app.use(cors())

const pool = new Pool()

const db = require('./db')

const rootValue = {
  todos: async () => {
    const query = ['SELECT * FROM "todo";']
    return await db.manyOrNone(...query)
  },
  addTodo: async ({ input: { task } }) => {
    const query = ['INSERT INTO "todo"(task) VALUES($1) RETURNING *', [task]]
    return (await db.one(...query)) || []
  },
  editTodo: async ({ input: { task, id, completed } }) => {
    const query = [
      'UPDATE "todo" SET completed = $1, task = $2 WHERE id = $3 RETURNING *',
      [completed, task, id],
    ]
    return await db.one(...query)
  },
  deleteTodo: async ({ id }) => {
    const query = ['DELETE FROM "todo" WHERE id = $1 RETURNING *', [id]]
    return await db.one(...query)
  },
  users: async () => {
    const query = ['SELECT * FROM "user";']
    return (await db.manyOrNone(...query)) || []
  },
  deleteUser: async ({ id }) => {
    const query = ['DELETE FROM "user" WHERE id = $1 RETURNING *', [id]]
    return await db.one(...query)
  },
  addUser: async ({ input: { name } }) => {
    const query = ['INSERT INTO "user"(name) VALUES($1) RETURNING *', [name]]
    return await db.one(...query)
  },
  userTodos: async ({ id }) => {
    const query = [
      `
    select "t"."task", "t"."completed", "t"."id"
    from "todo" "t" 
    join "user_todo" "ut" on "ut"."todoID" = "t"."id" 
    join "user" "u" on "u"."id" = "ut"."userID" where "u"."id" = $1;
    `,
      [id],
    ]
    return (await db.manyOrNone(...query)) || []
  },
  todoUsers: async ({ id }) => {
    const query = [
      `select "u"."name", "u"."id" from "user" "u" join "user_todo" "ut" on "ut"."userID" = "u"."id" where "ut"."todoID" = $1`,
      [id],
    ]
    return (await db.manyOrNone(...query)) || []
  },
}

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
)
const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Running a GraphQL API server at localhost:${port}/graphql`))
