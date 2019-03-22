import React, { Component } from 'react';
import styled from 'styled-components';

const XIcon = styled.span`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 1px solid black;
  cursor: pointer;
`;
class Todo extends Component {
  state = { hovering: false };
  render() {
    const { id, task, completed, onClick } = this.props;
    const { hovering } = this.state;
    return (
      <div
        onMouseEnter={() => this.setState({ hovering: true })}
        onMouseLeave={() => this.setState({ hovering: false })}
      >
        # {id} : {task} <input type="checkbox" checked={completed} />{' '}
        {hovering && <XIcon onClick={onClick}>X</XIcon>}
      </div>
    );
  }
}
export default props => <Todo {...props} />;
