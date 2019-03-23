import React, { Component } from 'react';
import client from './apollo';
import gql from 'graphql-tag';
import { GET_USERS } from './UsersList';

export const ADD_USER = gql`
  mutation AddTodo($input: UserInput!) {
    addUser(input: $input) {
      name
    }
  }
`;

class AddUser extends Component {
  state = { name: '' };
  handleChange = e => this.setState({ name: e.target.value });
  handleSubmit = async e => {
    e.preventDefault();
    const { name } = this.state;
    const trimmed = name.trim();
    if (trimmed) {
      await client.mutate({
        variables: { input: { name: trimmed } },
        mutation: ADD_USER,
        refetchQueries: () => [{ query: GET_USERS }],
      });
    }
  };
  render() {
    const { handleChange, handleSubmit } = this;
    const { name } = this.state;
    return (
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          placeholder={'new user...'}
          onChange={handleChange}
        />
        <button type="submit">Add</button>
      </form>
    );
  }
}

export default AddUser;
