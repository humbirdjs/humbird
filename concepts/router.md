# Router

Humbird use `react-router-dom` v4 as its router. Feel free to import all of `react-router-dom` component.

```js
import { Router, Route } from 'react-router-dom'
```

#### Registry the route

You need to use `app.router()` to registry the route component. This is important because humbird will wrap it with `mobx-react`'s `<Provider>`. This is how `connect()` can get the wrapped view components updated:

```js
app.router(({history}) => (
  <Router history={history}>
    <Route path='/foo' component={Foo} />
  </Router>
))
```