import React from 'react';
import User from './User';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import AddUser from './AddUser';

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
    }
  }
`;

export default () => (
  <>
    <h1>Users</h1>
    <Query query={GET_USERS}>
      {({ loading, data, errors }) =>
        !loading && data && data.users && data.users.map(User)
      }
    </Query>
    <AddUser />
    <br />
  </>
);
