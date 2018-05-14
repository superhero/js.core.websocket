const
Debug     = require('@superhero/debug'),
Websocket = require('@superhero/websocket')

module.exports = class
{
  constructor(router, options)
  {
    this.config = Object.assign({ prefix:'websocket server:' }, options)
    this.router = router
    this.debug  = new Debug(this.config)
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
    request = Object.freeze({ name:event, data }),
    input   = { path:event },
    route   = Object.freeze(await this.router.findRoute(input)),
    session = {}

    if(!route.endpoint)
    {
      this.debug.log('event:', event, 'error:', 'endpoint not found')
      context.emit('error', 'endpoint not found')
      return
    }

    function * chain(Dispatcher)
    {
      const dispatcher = new Dispatcher(request, route, session)
      for(const [event, data, toAll] of dispatcher.dispatch(dispatch))
        yield [event, data, toAll]
    }

    function * dispatch()
    {
      if(route.dispatchers.length)
      {
        const dispatcher = route.dispatchers.shift()
        for(const [event, data, toAll] of chain(dispatcher))
          yield [event, data, toAll]
      }
    }

    try
    {
      for(const [event, data, toAll] of dispatch())
        context.emit(event, data, toAll)
    }
    catch(error)
    {
      this.debug.log('event:', event, 'data:', data, 'error:', error)
      context.emit('error')
    }
  }
}
