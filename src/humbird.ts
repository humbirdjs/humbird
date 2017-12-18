import * as React from 'react'
import { createBrowserHistory } from 'history'
import { render } from 'react-dom'
import { IObservable, observable, useStrict, extendObservable, computed, action, spy, intercept, observe } from 'mobx'
import { inject, Provider, observer } from 'mobx-react'
import { asyncAction } from "mobx-utils"
import { defineReadOnlyProperty, isReadonly, lowerCaseFirst } from './utils'

export * from 'history'
export { observer }

/**
 * Model interface.
 */
export interface IModel {
  name: string,
  readonly?: boolean,
  observable?: any,
  state?: { [name: string]: any },
  refState?: { [name: string]: any },
  shallowState: { [name: string]: any },
  computed?: { [name: string]: () => any }
  actions?: { [name: string]: (app: Humbird) => () => void } | { [name: string]: () => void },
  asyncActions?: { [name: string]: (app: Humbird) => () => void } | { [name: string]: () => void },
  interceptors?: { [name: string]: (app: Humbird) => () => void } | { [name: string]: () => void },
}

/**
 * Plugin interface.
 */
export interface IPlugin {
  (app: Humbird, options: any): void
}

/**
 * Router interface.
 */
export interface IRouter {
  ({app: Humbird, history: Object}): JSX.Element | Object;
}

/**
 * Listener interface.
 */
export interface IListener {
  (event): void
}

/**
 * Map IModel instance to Observable.
 * @param app Humbird instance
 * @param model IModel instance
 */
const modelToObservable = (app: Humbird, model: IModel) => {
  let o = extendObservable({})

  // apply observable: object or function
  if (model.observable) {
    o = typeof model.observable === 'function' ? model.observable(app) : model.observable
  }

  // apply state: @observable
  if (model.state) {
    extendObservable(o, model.state)
  }

  // apply refState: @observable.ref
  if (model.refState) {
    for (let name in model.refState) {
      extendObservable(o, {
        [name]: observable.ref(model.refState[name])
      })
    }
  }

  // apply shallowState: @observable.shallow
  if (model.shallowState) {
    for (let name in model.shallowState) {
      extendObservable(o, {
        [name]: observable.shallow(model.shallowState[name])
      })
    }
  }

  // apply computed: @computed
  if (model.computed) {
    for (let name in model.computed) {
      extendObservable(o, {
        [name]: computed(model.computed[name])
      })
    }
  }

  // apply actions: @action
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

/**
 * Humbird main class.
 */
export class Humbird {

  private _routerComponent: JSX.Element
  private _mountedRoot?: Element | null
  private _sourceModels: IModel[] = []
  private _observableModels = {}
  private _history = null

  public constructor(options) {
    const { history: theHistory } = options
    this._history = theHistory || createBrowserHistory()
  }

  get models () {
    return this._observableModels
  }

  get history() {
    return this._history
  }

  /**
   * Config router.
   *
   * @param router
   */
  router (router: IRouter) {
    this._routerComponent = React.createElement(Provider, this.models, router({ app: this, history: this._history }))
  }

  /**
   * Config root component.
   * 
   * @param root root component
   */
  root (root: JSX.Element | Object) {
    this._routerComponent = React.createElement(Provider, this.models, root)
  }

  /**
   * Register a model.
   *
   * @param model
   */
  model (model: IModel) {
    const o = modelToObservable(this, model)
    if (isReadonly(model)) { // default false
      defineReadOnlyProperty(this._observableModels, model.name, o, `model [${model.name}] is readonly.`)
    } else {
      this._observableModels[model.name] = o
    }
    this._sourceModels.push(model)
  }

  /**
   * Start the application.
   *
   * @param el Element | string
   */
  start (el: Element | string) {
    // apply subscriptions (name not contains `willChange` or `didChange`)
    for (const model of this._sourceModels) {
      if (model.interceptors) {
        const interceptors = typeof model.interceptors === 'function' ? model.interceptors(this) : model.interceptors
        for (let name in interceptors) {
          // intercept
          if (name.indexOf('willChange') == -1 && name.indexOf('didChange') == -1) {
            const sub = interceptors[name]
            sub({app: this, history: this._history}) // run subscriptions
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
    render(this._routerComponent, container)
    this._mountedRoot = container
  }

  /**
   * Register an object of hooks on the application.
   *
   * @param plugin
   */
  use (plugin: IPlugin, options?) {
    plugin(this, options)
  }

  /**
   * Register a global listener
   * 
   * @param listener 
   */
  spy (listener: IListener) {
    spy(listener)
  }
}

/**
 * HumbirdOptions interface
 */
export interface IHumbirdOptions {
  useStrict?: boolean,
  initialState?: Object,
  history?: Object
}

/**
 * mapModelsToProps type
 */
export type IMapModelsToProps = (models: any, nextProps: any, context: any) => any;

/**
 * Build humbird instance
 * 
 * @param options 
 */
export default function humbird(options: IHumbirdOptions = { useStrict: true }): Humbird {
  if (options.useStrict === true) {
    useStrict(true)
  }
  return new Humbird(options)
}

/**
 * connect models to component as props
 * @param mapModelsToProps 
 */
export const connect = (mapModelsToProps: IMapModelsToProps) => {
  return function(view) {
    return inject(mapModelsToProps)(observer(view))
  }
}
