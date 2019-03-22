import React from 'react'
import Todo from './Todo'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      task
      completed
    }
  }
`
export default () => (
  <Query query={GET_TODOS}>{({ loading, data }) => !loading && data.todos.map(Todo)}</Query>
)
