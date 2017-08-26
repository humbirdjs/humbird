import React from 'react'
import DevTools from 'mobx-react-devtools'
import { observer, inject } from '../../../lib/humbird'
import TodoView from './TodoView'

const TodoList = function({ models }) {
  const onNewTodo = () => {
    models.todoModel.addTodo(prompt('Enter a new todo:','coffee plz'));
  }
  return (
    <div>
        <DevTools />
        { models.todoModel.report }
        <ul>
        { models.todoModel.todos.map(
            (todo, idx) => <TodoView todo={ todo } key={ idx } />
        ) }
        </ul>
        { models.todoModel.pendingRequests > 0 ? <marquee>Loading...</marquee> : null }
        <button onClick={ onNewTodo }>New Todo</button>
        <small> (double-click a todo to edit)</small>
    </div>
  )
}

export default inject(TodoList)
