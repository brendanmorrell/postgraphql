import React from 'react';
import TodoList from './TodoList';
import UsersList from './UsersList';

export default () => (
  <div>
    <UsersList key="UsersList" />
    <TodoList key="TodoList" />
  </div>
);
