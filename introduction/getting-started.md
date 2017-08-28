# Getting Started

#### Installation

```bash
$ yarn add humbird
```

#### Simplest counter application

Let see a simplest counter application write in humbird:

```js
import humbird, { connect } from 'humbird'
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
function mapModelsToProps({ counter }) {
  return { counter }
}
const Counter = connect(mapModelsToProps)(({ counter })) => {
  return (
    <div>
      <span>{counter.count}</span>
      <button onClick={counter.incr}>+</button>
      <button onClick={counter.decr}>-</button>
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

We use `app.model()` to registry a model. For the view component, we use `connect` to connect models to React component props, which will automatically re-render by MobX. As for the route, it is a function that return a `react-router` route component.

Finally, we use `app.start()` to mount the app.
