import React from 'react';
import styled from 'styled-components';

const Radio = styled.span`
  background-color: ${props => (props.selected ? 'firebrick' : 'lightgray')};
  color: white;
  cursor: pointer;
`;
export default ({ name }) => <Radio selected={name}>{name}</Radio>;
