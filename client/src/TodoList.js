import React from 'react';
import Todo from './Todo';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

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
  <Query query={GET_TODOS}>
    {({ loading, data, errors }) =>
      !loading && data && data.todos && data.todos.map(Todo)
    }
  </Query>
);
