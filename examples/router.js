import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Counter from './components/Counter'

const router = () => (
    <BrowserRouter>
      <Route path='/' component={Counter} />
    </BrowserRouter>
  )

export default router