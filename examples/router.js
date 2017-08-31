import React from 'react'
import { Router, Route, Link } from 'react-router-dom'
import TodoList from './routers/todoList'

const router = ({history}) => (
  <Router history={history}>
      <div>
        <ul>
        <li><Link to="/">HOME</Link></li>
        <li><Link to="/todos">TODOS</Link></li>
      </ul>
      <hr/>
      <Route exact path='/' component={TodoList} />
      <Route path='/todos' component={TodoList} />
    </div>
  </Router>
)

export default router