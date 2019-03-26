import React, { Component } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import client from './apollo';
import { GET_USERS } from './UsersList';
import { Query } from 'react-apollo';
import Todo from './Todo';

const XIcon = styled.span`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 1px solid black;
  cursor: pointer;
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

const GET_USER_TODOS = gql`
  query UserTodos($id: ID!) {
    userTodos(id: $id) {
      id
      task
      completed
    }
  }
`;

class User extends Component {
  state = { hovering: false };
  handleDelete = async () => {
    const { id } = this.props;
    await client.mutate({
      variables: { id },
      mutation: DELETE_USER,
      refetchQueries: () => [{ query: GET_USERS }],
    });
  };
  render() {
    const { id, name } = this.props;
    const { hovering } = this.state;
    const { handleDelete } = this;
    return (
      <div
        onMouseEnter={() => this.setState({ hovering: true })}
        onMouseLeave={() => this.setState({ hovering: false })}
        key={id}
      >
        # {id} : {name} {hovering && <XIcon onClick={handleDelete}>X</XIcon>}
        <Query query={GET_USER_TODOS} variables={{ id }}>
          {({ loading, data }) =>
            (!loading && data && <ul>{data.userTodos.map(Todo)}</ul>) || null
          }
        </Query>
      </div>
    );
  }
}
export default props => <User {...props} />;
