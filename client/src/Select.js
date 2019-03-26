import React from 'react';
import styled from 'styled-components';

const Radio = styled.button`
  background-color: ${props => (props.selected ? 'firebrick' : 'lightgray')};
  color: ${props => (props.selected ? 'white' : 'black')};
  cursor: pointer;
`;
export default ({ name, assignees = [] }) => (
  <Radio selected={assignees.includes(name)}>{name}</Radio>
);
