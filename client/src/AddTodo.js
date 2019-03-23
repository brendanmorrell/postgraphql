import React, { Component } from 'react';
import client from './apollo';
import gql from 'graphql-tag';
import { GET_TODOS } from './TodoList';

export const ADD_TODO = gql`
  mutation AddTodo($input: TodoInput!) {
    addTodo(input: $input) {
      task
    }
  }
`;

class AddTodo extends Component {
  state = { task: '' };
  handleChange = e => this.setState({ task: e.target.value });
  handleSubmit = async e => {
    e.preventDefault();
    const { task } = this.state;
    const input = task.trim();
    if (input) {
      await client.mutate({
        variables: { input: { task } },
        mutation: ADD_TODO,
        refetchQueries: () => [{ query: GET_TODOS }],
      });
    }
  };
  render() {
    const { handleChange, handleSubmit } = this;
    const { task } = this.state;
    return (
      <form onSubmit={handleSubmit}>
        <input
          value={task}
          placeholder={'new todo...'}
          onChange={handleChange}
        />
        <button type="submit">Add</button>
      </form>
    );
  }
}

export default AddTodo;
