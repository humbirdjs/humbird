import React from 'react'
import DevTools from 'mobx-react-devtools'
import { connect } from '../../../lib/humbird'
import TodoView from '../../components/Todo/TodoView'

const TodoList = function({ todoModel }) {
  console.log('render TodoList')
  const onNewTodo = () => {
    todoModel.addTodo(prompt('Enter a new todo:','coffee plz'));
  }
  return (
    <div>
        <DevTools />
        { todoModel.report }
        <ul>
        { todoModel.todos.map(
            (todo, idx) => <TodoView todo={ todo } key={ idx } />
        ) }
        </ul>
        { todoModel.pendingRequests > 0 ? <marquee>Loading...</marquee> : null }
        <button onClick={ onNewTodo }>New Todo</button>
        <small> (double-click a todo to edit)</small>
    </div>
  )
}
function mapModelsToProps({ todoModel }) {
  return { todoModel }
}

export default connect(mapModelsToProps)(TodoList)
