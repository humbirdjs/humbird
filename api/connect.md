# connect

`connect` is a magic function that connect models to props and makes your view component reactive.

### connect(mapModelsToProps): ((view) => ReactComponent)

Wrapping your view with `mobx-react`'s `observer`, and inject the whole `app.models` into `models` props at the same time.

Example:

```js
function Counter({ counter }) => {
  return(
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
