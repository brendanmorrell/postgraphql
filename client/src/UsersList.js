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
    <h1 key="h1">Users</h1>
    <Query query={GET_USERS} key="Query">
      {({ loading, data, errors }) =>
        (!loading && data && data.users && data.users.map(User)) || null
      }
    </Query>
    <AddUser key="AddUSer" />
    <br />
  </>
);
