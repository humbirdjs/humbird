import { observable, action } from 'mobx'
import React from 'react'
import assert from 'power-assert'
import { mount, shallow } from 'enzyme'
import humbird, { observer, inject } from '../lib/humbird'

const httpPlugin = (app, options) => {
  app.http = url => new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(options.response)
    }, 1000)
  })
}

describe('plugin system', () => {
  const app = humbird()

  app.use(httpPlugin, { response: 'fake response' })

  app.model({
    namespace: 'weather',
    state: {
      data: ''
    },
    actions: {
      applyData(data) {
        this.data = data
      },
      fetchWeather: async function() {
        const data = await app.http('blablabla')
        this.applyData(data)
      }
    }
  })

  const Weather = inject(({ models }) => {
    return (
      <div>
        <p id='data'>{models.weather.data}</p>
        <button onClick={models.weather.fetchWeather}>fetch weather...</button>
      </div>
    )
  })

  it('should use plugin', done => {
    assert(app.http)
    done()
  })

  it('should fetch weather data', done => {
    app.models.weather.fetchWeather()
      .then(res => {
        done(res)
      })
      .catch(e => {
        done(e)
      })
  })

  it('should change weather data', done => {
    const wrapped = shallow(<Weather.wrappedComponent models={app.models} />)

    assert.equal(wrapped.find('#data').first().text(), 'fake response')

    done()
  })
})