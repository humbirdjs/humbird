import React from 'react'
import { observable, action } from 'mobx'
import { BrowserRouter, Route } from 'react-router-dom'
import humbird from '../lib/humbird'
import Counter from './Counter'
import { counterStore } from './Counter/model'

const app = humbird()

app.model({
  namespace: 'counter',
  state: {
    count: 0,
  },
  actions: {
    incr: function() {
      this.count += 1
    },
    decr: function() {
      this.count -= 1
    }
  }
})

const router = () => (
  <BrowserRouter>
    <Route path='/' component={Counter} />
  </BrowserRouter>
)

app.router(router)

app.start(document.querySelector('#app'))
