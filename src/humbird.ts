import * as React from 'react'
import { createBrowserHistory } from 'history'
import { render } from 'react-dom'
import { IObservable, observable, useStrict, extendObservable, computed, action, spy, intercept, observe } from 'mobx'
import { inject, Provider, observer } from 'mobx-react'
import { asyncAction } from "mobx-utils"
import { defineReadOnlyProperty, isReadonly, lowerCaseFirst } from './utils'

export * from 'history'

export interface IModel {
  name: string,
  readonly?: boolean,
  state?: { [name: string]: any },
  computed?: { [name: string]: () => any }
  actions?: { [name: string]: (app: Humbird) => () => void } | { [name: string]: () => void },
  asyncActions?: { [name: string]: (app: Humbird) => () => void } | { [name: string]: () => void },
  interceptors?: { [name: string]: (app: Humbird) => () => void } | { [name: string]: () => void },
}

export interface IPlugin {
  (app: Humbird, options: any): void
}

export interface IRouter {
  ({app: Humbird, history: Object}): JSX.Element | Object;
}

export interface IListener {
  (event): void
}

const modelToObservable = (app: Humbird, model: IModel) => {
  let o = extendObservable({})

  // apply state
  if (model.state) {
    extendObservable(o, model.state)
  }

  // apply computed
  if (model.computed) {
    for (let name in model.computed) {
      extendObservable(o, {
        [name]: computed(model.computed[name])
      })
    }
  }

  // apply actions
  if (model.actions) {
    // if actions is function, pass an app instance
    const actions = typeof model.actions === 'function' ? model.actions(app) : model.actions
    for (let name in actions) {
      extendObservable(o, {
        [name]: action.bound(actions[name] as any)
      })
    }
  }

  // apply async actions
  if (model.asyncActions) {
    // if asyncActions is function, pass an app instance
    const asyncActions = typeof model.asyncActions === 'function' ? model.asyncActions(app) : model.asyncActions
    for (let name in asyncActions) {
      extendObservable(o, {
        [name]: asyncAction(name, asyncActions[name] as any)
      })
    }
  }

  // apply intercept & observe
  if (model.interceptors) {
    // if asyncActions is function, pass an app instance
    const interceptors = typeof model.interceptors === 'function' ? model.interceptors(app) : model.interceptors
    for (let name in interceptors) {
      // intercept
      if (name.indexOf('willChange') > -1) {
        intercept(o, lowerCaseFirst(name.slice(10)), interceptors[name] as any)
      }
      // observe
      else if (name.indexOf('didChange') > -1) {
        observe(o, lowerCaseFirst(name.slice(9)), interceptors[name] as any)
      }
    }
  }
  
  return o
}

export class Humbird {

  private __routerComponent: JSX.Element
  private __mountedRoot?: Element | null

  private __models: IModel[] = []
  private __modelsObject = {}

  private __history = null

  public constructor(options) {
    const { history } = options
    this.__history = history || createBrowserHistory()
  }

  private __getInjectList () {
    return this.__models.map(model => model.name).filter(_ => _)
  }

  get models () {
    return this.__modelsObject
  }

  /**
   * Config router.
   *
   * @param router
   */
  router (router: IRouter) {
    this.__routerComponent = React.createElement(Provider, this.models, router({ app: this, history: this.__history }))
  }

  /**
   * Register a model.
   *
   * @param model
   */
  model (model: IModel) {
    // registry model
    const o = modelToObservable(this, model)
    if (isReadonly(model)) { // default false
      defineReadOnlyProperty(this.__modelsObject, model.name, o, `model [${model.name}] is readonly.`)
    } else {
      this.__modelsObject[model.name] = o
    }
    this.__models.push(model)
  }

  unmodel (name) {
    // delete model from this.__models
    this.__models = this.__models.filter(model => model.name !== name);
  }

  /**
   * Start the application. Selector is optional. If no selector
   * arguments, it will return a function that return JSX elements.
   *
   * @param el Element | string
   */
  start (el: Element | string) {
    // run subscriptions
    for (const model of this.__models) {
      if (model.interceptors) {
        const interceptors = typeof model.interceptors === 'function' ? model.interceptors(this) : model.interceptors
        for (let name in interceptors) {
          // intercept
          if (name.indexOf('willChange') == -1 && name.indexOf('didChange') == -1) {
            const sub = interceptors[name]
            sub({app: this, history: this.__history})
          }
        }
      }
    }
    // support selector
    let container : Element | null
    if (typeof el === 'string') {
      container = document.querySelector(el);
    } else {
      container = el
    }
    render(this.__routerComponent, container)
    this.__mountedRoot = container
  }

  /**
   * Register an object of hooks on the application.
   *
   * @param hooks
   */
  use (plugin: IPlugin, options?) {
    plugin(this, options)
  }

  spy (listener: IListener) {
    spy(listener)
  }
}

export interface HumbirdOptions {
  useStrict?: boolean,
  initialState?: Object,
  history?: Object
}

export default function humbird(options: HumbirdOptions = { useStrict: true }): Humbird {
  if (options.useStrict === true) {
    useStrict(true)
  }
  return new Humbird(options)
}

// connect models to component as props
export const connect = (mapModelsToProps) => {
  return function(view) {
    return inject(mapModelsToProps)(observer(view))
  }
}

export { observer }
