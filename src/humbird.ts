import * as React from 'react'
import { render } from 'react-dom'
import { IObservable, observable, useStrict, extendObservable, action, computed, spy } from 'mobx'
import { inject as mobxInject, Provider, observer } from 'mobx-react'
import { defineReadOnlyProperty, isReadonly } from './utils'

export interface IModel {
  namespace: string,
  readonly?: boolean,
  state?: { [name: string]: any },
  actions?: { [name: string]: (app: Humbird) => () => void } | { [name: string]: () => void },
  computed?: { [name: string]: () => any }
}

export interface IModelObject {
  [namespace: string]: IObservable
}

export interface IPluginObject {
  [namespace: string]: any
}

export interface IPlugin {
  (app: Humbird, options: any): void
}

export interface IRouter {
  (): JSX.Element | Object;
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

  // apply computed
  if (model.computed) {
    for (let name in model.computed) {
      extendObservable(o, {
        [name]: computed(model.computed[name])
      })
    }
  }

  return o
}

export class Humbird {

  private __routerComponent: JSX.Element
  private __mountedRoot?: Element | null

  private __models: IModel[] = []
  private __modelsObject = {}

  private __getInjectList () {
    return this.__models.map(model => model.namespace).filter(_ => _)
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
    // wrap provider
    const providerProps = {}
    this.__routerComponent = React.createElement(Provider, this.models, router())
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
      defineReadOnlyProperty(this.__modelsObject, model.namespace, o, `model [${model.namespace}] is readonly.`)
    } else {
      this.__modelsObject[model.namespace] = o
    }
    this.__models.push(model)
  }

  unmodel (namespace) {
    // delete model from this.__models
    this.__models = this.__models.filter(model => model.namespace !== namespace);
  }

  /**
   * Start the application. Selector is optional. If no selector
   * arguments, it will return a function that return JSX elements.
   *
   * @param el Element | string
   */
  start (el: Element | string) {
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
  useStrict?: boolean
}

export default function humbird(options: HumbirdOptions = {}): Humbird {
  if (options.useStrict === true) {
    useStrict(true)
  }
  return new Humbird()
}

// connect models to component as props
export const connect = (mapModelsToProps) => {
  return function(view) {
    return mobxInject(mapModelsToProps)(observer(view))
  }
}

export { observer }
