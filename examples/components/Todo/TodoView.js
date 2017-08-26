import React from 'react'
import DevTools from 'mobx-react-devtools'
import { observer, inject } from '../../../lib/humbird'

const TodoView = function({ todo }) {
    const onToggleCompleted = () => {
        todo.completed = !todo.completed
    }
    
    const onRename = () => {
        todo.task = prompt('Task name', todo.task) || todo.task
    }
    return (
      <li onDoubleClick={ onRename }>
        <input
          type='checkbox'
          checked={ todo.completed }
          onChange={ onToggleCompleted }
        />
        { todo.task }
        { todo.assignee
          ? <small>{ todo.assignee.name }</small>
          : null
        }
      </li>
    );
}

export default inject(TodoView)
