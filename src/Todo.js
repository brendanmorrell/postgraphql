import React from 'react'

export default ({ id, task, completed }) => (
  <div>
    {id}:{task}, Completed: {String(completed)}
  </div>
)
