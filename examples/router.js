import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import TodoList from './components/Todo/TodoList'

const router = () => (
    <BrowserRouter>
      <Route path='/' component={TodoList} />
    </BrowserRouter>
  )

export default router