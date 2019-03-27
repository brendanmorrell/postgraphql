import React, { Component } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import client from './apollo';
import { GET_TODOS } from './TodoList';
import { Query } from 'react-apollo';
import Select from './Select';
import { GET_USERS } from './UsersList';

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

const GET_TODO_USERS = gql`
  query TodoUsers($id: ID!) {
    todoUsers(id: $id) {
      id
      name
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
    const { id, task, completed, isMainTodo } = this.props;
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
          <Query query={GET_USERS} key="Query">
            {({ loading, data, errors }) =>
              (!loading && data && data.users && (
                <Query query={GET_TODO_USERS} variables={{ id }}>
                  {({ loading, data: todoData }) =>
                    data.users.map(
                      ({ name }) =>
                        isMainTodo && (
                          <Select
                            name={name}
                            assignees={
                              (todoData &&
                                todoData.todoUsers &&
                                todoData.todoUsers.map(({ name }) => name)) ||
                              []
                            }
                          />
                        ),
                    ) || null
                  }
                </Query>
              )) ||
              null
            }
          </Query>
        </div>
      </div>
    );
  }
}
export default props => <Todo {...props} />;
