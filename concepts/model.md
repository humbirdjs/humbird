# Model

`model` in humbird is an object contains `name`, `state`, `computed`, `actions`,`asyncActions`and `interceptors`:

```js
import { observable } from 'humbird/mobx'
const counterModel = {
  name: 'counter',
  state: {
    count: 0
  },
  computed: {
    content() {
      return 'Totally' + this.count
    }
  },
  actions: {
    incr() {
      /** ... **/
    }
  },
  asyncActions: {
    * fetchCount() {
      yeild fetch(...)
      /** ... **/
    }
  },
  interceptors: {
    setup({app, history}) {
      /** ... **/
    }
    willChangeCount(change) {
      /** ... **/
      return change
    },
    didChangeCount(change) {
      /** ... **/
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
  name: 'homepage',
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
  name: 'counter',
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
  name: 'foo',
  /** ... **/
})

app.models.foo = {} // it's ok
```

In some cases you want your models be readonly. Just set the `readonly` to `true`:

```js
app.model({
  name: 'foo',
  readonly: true
  /** ... **/
})

app.models.foo = {} // Throw error
```
