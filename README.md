# Core › Websocket

Licence: [MIT](https://opensource.org/licenses/MIT)

---

[![npm version](https://badge.fury.io/js/%40superhero%2Fcore.websocket.svg)](https://badge.fury.io/js/%40superhero%2Fcore.websocket)

This is an addon module that implements the [superhero/websocket](https://github.com/superhero/js.websocket) module with the [superhero/core](https://github.com/superhero/js.core) module. This addon will apply an additional option to the server, eg: `websocket`. As websockets are bidirectional, a different multiplex dispatcher approach is required.

Have a look at the [superhero/websocket](https://github.com/superhero/js.websocket) module for more information, code and tests related to what's presented here.

## Install

`npm install @superhero/core.websocket`

...or just set the dependency in your `package.json` file:

```json
{
  "dependencies":
  {
    "@superhero/core.websocket": "*"
  }
}
```

## Example Application

A simple example to get started follows.

### Example Application › File structure

```
App
├── controller
│   ├── foobar.js
│   └── logger.js
├── config.js
├── index.js
└── package.json
```

#### `package.js`

```js
{
  "name": "Super Duper App",
  "version": "0.0.1",
  "description": "An example meant to describe the libraries fundamentals",
  "license": "MIT",
  "dependencies": {
    "@superhero/core.websocket": "*"
  }
}

```

#### `config.js`

```js
module.exports =
{
  bootstrap:
  {
    '@superhero/core.websocket':{}
  },
  routes:
  [
    {
      endpoint  : 'controller/foobar',
      chain     : 'controller/logger',
      policy    : 'foo'
    }
  ]
}
```

#### `index.js`

```js
const
config  = require('./config'),
core    = require('@superhero/core')

core.bootstrap().then(() => core.server('websocket', config.routes).listen(80))
```

#### `controller/foobar.js`

```js
const Dispatcher = require('@superhero/core.websocket/dispatcher')

module.exports = class extends Dispatcher
{
  * dispatch()
  {
    yield [this.input.event, this.input.data]
  }
}
```

#### `controller/logger.js`

```js
const Dispatcher = require('@superhero/core.websocket/dispatcher')

// Middleware dispatcher
// Inherits the same interface and functionality as an endpoint dispatcher
module.exports = class extends Dispatcher
{
  * dispatch(next)
  {
    console.log('received', new Date().toISOString())

    for(const args of next())
    {
      console.log('responding', new Date().toISOString())
      yield [...args]
    }

    console.log('done', new Date().toISOString())
  }
}

```

The bootstrap process is the key to add and be able to use the addon.

You can now connect to the server and send the event "foo" with any data, and it will respond with that same event and data. This is ofc useless, but works as an example to show some fundamentals about the module.

If you want to read more a more about the client end, have a look at the dependent module: [superhero/websocket](https://github.com/superhero/js.websocket) that also contain a browser version to connect to the socket through.
