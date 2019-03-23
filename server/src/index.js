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
    const query = 'SELECT * FROM "todo";'
    return await db.manyOrNone(query)
  },
  addTodo: async ({ input: { task } }) =>
    await db.one('INSERT INTO "todo"(task) VALUES($1) RETURNING *', [task]),
  editTodo: async ({ input: { task, id, completed } }) => {
    return await db.one('UPDATE "todo" SET completed = $1, task = $2 WHERE id = $3 RETURNING *', [
      completed,
      task,
      id,
    ])
  },
  deleteTodo: async ({ id }) => {
    return await db.one('DELETE FROM "todo" WHERE id = $1 RETURNING *', [id])
  },
  users: async () => {
    const query = 'SELECT * FROM "user";'
    return await db.manyOrNone(query)
  },
  deleteUser: async ({ id }) => {
    return await db.one('DELETE FROM "user" WHERE id = $1 RETURNING *', [id])
  },
  addUser: async ({ input: { name } }) => {
    console.log('TCL: name', name)

    return await db.one('INSERT INTO "user"(name) VALUES($1) RETURNING *', [name])
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
