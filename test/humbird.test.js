import React from 'react'
import assert from 'power-assert'
import { BrowserRouter, Route } from 'react-router-dom'
import humbird from '../lib/humbird'

describe('humbird', () => {
  let app

  const App = () => <div>humbird index</div>

  const router = () => (
    <BrowserRouter>
      <Route path="/" component={App} />
    </BrowserRouter>
  )

  const rootEl = document.querySelector('#app')

  beforeEach(() => {
    app = humbird()

    app.model({
      name: 'foo',
      readonly: true,
      state: {
        data: 'foo',
      },
    })

    app.model({
      name: 'public',
      state: {
        data: 'foo',
      },
    })
  })

  afterEach(() => {
    app = null
  })

  describe('router', () => {
    it('should set router', (done) => {
      app.router(router)
      assert(app.__routerComponent)
      done()
    })
  })

  describe('safe', () => {
    it('model should be readonly', (done) => {
      assert.throws(() => { app.models.foo = 'bar' })
      done()
    })

    it('can modify none exist model', (done) => {
      assert.doesNotThrow(() => { app.models.blabla = 'bar' })
      done()
    })

    it('can modify none protected model', (done) => {
      assert.doesNotThrow(() => { app.models.public = 'foooo' })
      done()
    })
  })

  describe('start', () => {
    it('should throw error if router is not defined', (done) => {
      assert.throws(app.start)
      done()
    })

    it('should mount to specific element', (done) => {
      app.router(router)
      app.start(rootEl)
      assert(app.__mountedRoot === rootEl)
      done()
    })
  })
})
