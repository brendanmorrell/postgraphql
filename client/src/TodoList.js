import React from 'react';
import Todo from './Todo';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import AddTodo from './AddTodo';
export const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      task
      completed
    }
  }
`;

export default () => (
  <>
    <h1>Todos</h1>
    <Query query={GET_TODOS}>
      {({ loading, data, errors }) =>
        !loading && data && data.todos && data.todos.map(Todo)
      }
    </Query>
    <AddTodo />;
    <br />
  </>
);
