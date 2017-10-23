# Instance

### app = humbird(options)

Return a humbird app instance

#### options

- useStrict: boolean. Default true. Enable MobX strict mode.
- history: History.

### app.model(model)

Registry a model.

##### model

See [model](/concepts/model).

### app.use(plugin)

Registry a plugin.

##### plugin

See [plugin](/concepts/plugin).

### app.router(() => ReactRouterRouteComponent)

Apply the router.

### app.root(component)

Apply the root component when you do not use app.router.

See [router](/concepts/router)

### app.start(el: Element | string)

Mount the app.