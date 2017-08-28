# Router

humbird use `react-router-dom` v4 as its router. Feel free to import all of `react-router-dom` component.

```js
import { BrowserRouter, Route } from 'mobx/router'
```

#### Registry the route

You need to use `app.router()` to registry the route component. This is important because humbird will wrap it with `mobx-react`'s `<Provider>`. This is how `connect()` can get the wrapped view components updated:

```js
app.router(() => (
  <BrowserRouter>
    <Route path='/foo' component={Foo} />
  </BrowserRouter>
))
```