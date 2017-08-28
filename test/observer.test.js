import { observable, action } from 'mobx'
import React from 'react'
import assert from 'power-assert'
import { mount, shallow } from 'enzyme'
import humbird, { observer, connect } from '../lib/humbird'

describe('observer', () => {

  describe('normal observable', () => {
    const app = humbird()

    const counterModel = {
      name: 'counter',
      state: {
        count: 0,
      },
      actions: {
        incr() {
          this.count += 1
        },
        decr() {
          this.count -= 1
        }
      }
    }

    app.model(counterModel)

    const Counter = connect((models) => ({ models }))(({ models }) => {
      return (
        <div>
          <span id='count'>{models.counter.count}</span>
          <Toolbar title='test' />
        </div>
      )
    })

    const Toolbar = connect((models) => ({ models }))(({ models, title }) => {
      return (
        <div>
          <div id='title'>{title}</div>
          <button onClick={models.counter.incr}>+</button>
          <button onClick={models.counter.decr}>-</button>
        </div>
      )
    })

    const wrapped = shallow(<Counter.wrappedComponent models={ app.models } />)

    it('should increase count', done => {
      app.models.counter.incr()
      assert.equal(wrapped.find('#count').first().text(), '1')
      done()
    })

    it('should decre count', done => {
      app.models.counter.decr()
      app.models.counter.decr()
      assert.equal(wrapped.find('#count').first().text(), '-1')
      done()
    })
  })

  describe('mobx property', () => {
    const app = humbird()

    const testPlugin = app => {
      app.test = 'foo'
    }

    app.use(testPlugin)

    app.model({
      name: 'counter',
      state: {
        count: 0,
        title: ''
      },
      actions: appInstance => ({
        incr() {
          this.count += 1
        },
        decr() {
          this.count -= 1
        },
        setTitle() {
          this.title = appInstance.test
        }
      }),
      computed: {
        content() {
          return this.title + this.count
        }
      }
    })

    describe('state/action', () => {
      it('should increase count', done => {
        app.models.counter.incr()
        assert.equal(app.models.counter.count, 1)
        done()
      })

      it('should get app instance in action', done => {
        app.models.counter.setTitle()
        assert.equal(app.models.counter.title, 'foo')
        done()
      })
    })

    describe('computed', () => {
      it('should calculate computed value', done => {
        assert.equal(app.models.counter.content, app.models.counter.title + app.models.counter.count)
        done()
      })
    })

  })
})
