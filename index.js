const
Debug     = require('@superhero/debug'),
Websocket = require('@superhero/websocket')

module.exports = class
{
  constructor(options, router, locator)
  {
    this.config   = Object.assign({ prefix:'websocket server:' }, options)
    this.router   = router
    this.debug    = new Debug(this.config)
    this.locator  = locator
  }

  createServer(options)
  {
    const ws = new Websocket(options)
    ws.events.emit = this.dispatch.bind(this)
    return ws.server
  }

  async dispatch(event, context, data)
  {
    const
    input   = Object.freeze({ event, data }),
    route   = Object.freeze(await this.router.findRoute({ path:event })),
    session = { emit:context.emit },
    locator = Object.freeze(this.locator)

    if(!route.endpoint)
    {
      this.debug.log('event:', event, 'error:', 'endpoint not found')
      context.emit('error', 'endpoint not found')
      return
    }

    async function chain(Dispatcher)
    {
      const dispatcher = new Dispatcher(input, route, session, locator)
      await dispatcher.dispatch(dispatch)
    }

    let n = 0
    async function dispatch()
    {
      if(n < route.dispatchers.length)
      {
        await chain(route.dispatchers[n++])
      }
    }

    try
    {
      await dispatch()
    }
    catch(error)
    {
      this.debug.log('event:', event, 'data:', data, 'error:', error)
      context.emit('error', error.code)
    }
  }
}
