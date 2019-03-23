import React from 'react';
import User from './User';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export const GET_USERS = gql`
  query GetTodos {
    todos {
      id
      name
    }
  }
`;

export default () => (
  <Query query={GET_USERS}>
    {({ loading, data, errors }) =>
      !loading && data && data.users && data.users.map(User)
    }
  </Query>
);
