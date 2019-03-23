import React, { Component } from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import client from './apollo';
import { GET_USERS } from './UsersList';

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
      >
        # {id} : {name} {hovering && <XIcon onClick={handleDelete}>X</XIcon>}
      </div>
    );
  }
}
export default props => <User {...props} />;
