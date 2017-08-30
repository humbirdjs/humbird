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
        title: '',
        titleColor: "#ffffff"
      },
      computed: {
        content() {
          return this.title + this.count
        }
      },
      actions: appInstance => ({
        incr() {
          this.count += 1
        },
        decr() {
          this.count -= 1
        },
        setAppTitle() {
          this.title = appInstance.test
        },
        setTitle(title) {
          this.title = title
        },
        setTitleColor(color) {
          this.titleColor = color
        }
      }),
      asyncActions: {
        * fetchTitle (payload) {
          const data = yield new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve('test')
            }, 1000)
          })
          this.title = `${data} ${payload}`
        }
      },
      interceptors: {
        willChangeTitleColor(change) {
          if (!change.newValue) {
            // ignore attempts to unset the count
            return null;
          }
          if (change.newValue.length === 6) {
            // correct missing '#' prefix
            change.newValue = '#' + change.newValue;
            return change;
          }
          if (change.newValue.length === 7) {
              // this must be a properly formatted color code!
              return change;
          }
          if (change.newValue.length > 10) disposer(); // stop intercepting future changes
          throw new Error("This doesn't like a color at all: " + change.newValue);
        },
        didChangeTitle(change) {
          console.log('title change to', change.newValue, 'from', change.oldValue);
        }
      }
    })

    describe('computed', () => {
      it('should calculate computed value', done => {
        assert.equal(app.models.counter.content, app.models.counter.title + app.models.counter.count)
        done()
      })
    })

    describe('state/action', () => {
      it('should increase count', done => {
        app.models.counter.incr()
        assert.equal(app.models.counter.count, 1)
        done()
      })

      it('should change title', done => {
        app.models.counter.setTitle('ok')
        assert.equal(app.models.counter.title, 'ok')
        done()
      })

      it('should get app instance in action', done => {
        app.models.counter.setAppTitle()
        assert.equal(app.models.counter.title, 'foo')
        done()
      })
    })

    describe('state/asyncAction', () => {
      it('should change title', done => {
        app.models.counter.fetchTitle('fetch').then(() => {
          assert.equal(app.models.counter.title, 'test fetch')
          done()
        })
      })
    })


    describe('state/willChange', () => {
      it('should will change titleColor', done => {
        app.models.counter.setTitleColor('ffff00')
        assert.equal(app.models.counter.titleColor, '#ffff00')
        done()
      })
    })

    describe('state/didChange', () => {
      it('should did change title', done => {
        app.models.counter.setTitle('change title')
        done()
      })
    })

  })
})
