import React, { Component } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import client from './apollo';
import { GET_TODOS } from './TodoList';
import Select from './Select';
const XIcon = styled.span`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 1px solid black;
  cursor: pointer;
`;

export const EDIT_TODO = gql`
  mutation EditTodo($input: TodoInput!) {
    editTodo(input: $input) {
      id
      completed
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id) {
      id
    }
  }
`;

class Todo extends Component {
  state = { hovering: false };
  handleCheck = async () => {
    const { completed, task, id } = this.props;
    const todo = { completed: !completed, task, id };
    await client.mutate({
      variables: { input: { ...todo } },
      mutation: EDIT_TODO,
      refetchQueries: () => [{ query: GET_TODOS }],
    });
  };
  handleDelete = async () => {
    const { id } = this.props;
    await client.mutate({
      variables: { id },
      mutation: DELETE_TODO,
      refetchQueries: () => [{ query: GET_TODOS }],
    });
  };
  render() {
    const { id, task, completed } = this.props;
    const { hovering } = this.state;
    const { handleCheck, handleDelete } = this;
    return (
      <div
        onMouseEnter={() => this.setState({ hovering: true })}
        onMouseLeave={() => this.setState({ hovering: false })}
        key={id}
      >
        # {id} : {task}{' '}
        <input type="checkbox" checked={completed} onClick={handleCheck} />{' '}
        {hovering && <XIcon onClick={handleDelete}>X</XIcon>}
        <div>
          {[{ name: 1 }, { name: 2 }].map(x => (
            <Select {...x} />
          ))}
        </div>
      </div>
    );
  }
}
export default props => <Todo {...props} />;
