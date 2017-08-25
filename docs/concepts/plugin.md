# Plugin

Plugin is powerful and useful in humbird. It can inject everything in your humbird app instance. 

#### Writing a plugin

A humbird plugin is a function that receive two arguments: `app` and possible `options`:

```js
const loggerPlugin = (app, options) => {
  // add function in app instance
  app.logger = (msg) => {
    console.log('[from logger]:', msg)
  }
}
```

#### Using a plugin

```js
const app = humbird()

app.use(loggerPlugin)
```

#### Test the plugin

See [Unit test](/advanced/unit-test)

#### Plugin list

