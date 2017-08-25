# Getting Started

#### Installation

```bash
$ yarn add humbird
```

#### Simplest counter application

Let see a simplest counter application write in humbird:

```js
import humbird, { inject } from 'humbird'
import { BrowserRouter, Route } from 'humbird/router'

const app = humbird()

// model
app.model({
  namespace: 'counter',
  state: {
    count: 0
  },
  actions: {
    incr() {
      this.count += 1
    },
    decr() {
      this.count -= 1
    }
  }
})

// view
const Counter = inject(({ models })) => {
  return (
    <div>
      <span>{models.counter.count}</span>
      <button onClick={models.counter.incr}>+</button>
      <button onClick={models.counter.decr}>-</button>
    </div>
  )
}

// router
const router = () => (
  <BrowserRouter>
    <Route path='/' component={Counter} />
  </BrowserRouter>
)
app.router(router)

// mount the app
app.start(document.querySelector('#root'))
```

We use `app.model()` to registry a model. For the view component, we use `inject` to wrap a React component, which will automatically re-render by MobX. As for the route, it is a function that return a `react-router` route component.

Finally, we use `app.start()` to mount the app.
