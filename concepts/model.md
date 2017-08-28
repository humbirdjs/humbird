# Model

`model` in humbird is an object contains `namespace`, `state`, `actions` and `computed`:

```js
import { observable } from 'humbird/mobx'
const counterModel = {
  namespace: 'counter',
  state: {
    count: 0
  },
  actions: {
    incr() {
      /** ... **/
    }
  },
  computed: {
    content() {
      return 'Totally' + this.count
    }
  }
}

app.model(counterModel)
```

All models that had been registry by `app.model()` will define a observable property in `app.models`.

#### Communication between models

You can also pass a high order function to `actions`, which receives an `app` instance. That means you could do a lot with app instance. Such as accessing other models:

```js
const homepageModel = {
  namespace: 'homepage',
  state: {
    posts: []
  },
  actions: {
    fetch() {
      this.posts = ['blablabla']
    }
  }
}

const counterModel = {
  namespace: 'counter',
  actions: app => ({
    refresh() {
      app.models.hompage.fetch() // access homepage model
    }
  })
}

app.model(hompageModel)
app.model(counterModel)
```

### Access models in views

The way we access all models is using `connect()`:

```js
import { connect } from 'humbird'

function Counter(({ counter }) {
  return (
    <div>
      <span>{counter.count}</span>
    </div>
  )
}

function mapModelsToProps({ counter }) {
  return { counter }
}
export default connect(mapModelsToProps)(Counter)
```

The views that had been wrapped with `connect` will automatically wrapped with mobx-react's `observer`.

### Readonly Model

All the models are not readonly by default, which means that all the models regitered by `app.model()` can be change:

```js
app.model({
  namespace: 'foo',
  /** ... **/
})

app.models.foo = {} // it's ok
```

In some cases you don't want your models be readonly. Just set the `readonly` to `false`:

```js
app.model({
  namespace: 'foo',
  readonly: true
  /** ... **/
})

app.models.foo = {} // Throw error
```
