import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import TodoList from './routers/todoList'

const router = () => (
    <BrowserRouter>
      <Route path='/' component={TodoList} />
    </BrowserRouter>
  )

export default router