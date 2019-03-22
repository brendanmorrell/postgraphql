const express = require('express');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql-tag');
const { buildASTSchema } = require('graphql');

let TODOS = [
  { task: 'Walk the dog', completed: false },
  { task: 'Clean your room', completed: false },
  { task: 'drink too much', completed: true },
];

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
`);

const mapTodo = (todo, id) => todo && { id, ...todo };

const rootValue = {
  todos: () => TODOS.map(mapTodo),
  todo: ({ id }) => mapTodo(TODOS[id], id),
  addTodo: ({ input: { task } }) => {
    const todo = { task, completed: false };
    TODOS.push(todo);
    return mapTodo(todo, TODOS.length);
  },
  editTodo: ({ input: { task, id, completed } }) => {
    TODOS[id] = { task, completed };
    return { task, id, completed };
  },
  deleteTodo: ({ id }) => {
    const todo = TODOS[id];
    TODOS = TODOS.filter((x, i) => i !== +id);
    return { id, ...todo };
  },
};

const app = express();
app.use(cors());
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  }),
);

const port = process.env.PORT || 4000;
app.listen(port, () =>
  console.log(`Running a GraphQL API server at localhost:${port}/graphql`),
);
