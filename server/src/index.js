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
  }

  type Todo {
    id: ID!
    task: String!
    completed: Boolean!
  }

  type Mutation {
    addTodo(input: TodoInput!): Todo
    editTodo(input: TodoInput!): Todo
    deleteTodo(id: ID): Todo
  }

  input TodoInput {
    id: ID
    task: String
    completed: Boolean
  }
`)

const app = express()
app.use(cors())

const pool = new Pool()

const db = require('./db')

const rootValue = {
  todos: async () => {
    const query = 'SELECT * FROM "public"."todos";'
    return db.manyOrNone(query)
  },
  addTodo: async ({ input: { task } }) =>
    await db.one('INSERT INTO "public"."todos"(task) VALUES($1) RETURNING *', [task]),
  editTodo: async ({ input: { task, id, completed } }) => {
    return await db.one(
      'UPDATE "public"."todos" SET completed = $1, task = $2 WHERE id = $3 RETURNING *',
      [completed, task, id]
    )
  },
  deleteTodo: async ({ id }) => {
    return await db.one('DELETE FROM "public"."todos" WHERE id = $1 RETURNING *', [id])
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
