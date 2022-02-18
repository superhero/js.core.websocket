/**
 * @memberof Websocket
 */
class Server
{
  constructor(websocket, routes, schema, path, deepmerge, dispatcherChain, locator)
  {
    this.websocket        = websocket
    this.routes           = routes
    this.schema           = schema
    this.path             = path
    this.deepmerge        = deepmerge
    this.dispatcherChain  = dispatcherChain
    this.locator          = locator
  }

  bootstrap()
  {
    const inheritedRoute = {}

    for(const routeKey in this.routes || {})
    {
      const route = this.deepmerge.mergeInclusive({}, inheritedRoute, this.routes[routeKey])

      if(route.event && route.endpoint)
      {
        this.websocket.events.on(route.event, async (session, dto) =>
        {
          try
          {
            if(route.input)
            {
              try
              {
                dto = this.schema.compose(route.input, dto)
              }
              catch(previousError)
              {
                const error = new Error('could not compose the input model')
                error.chain = { previousError, route, dto }
                error.code  = 'E_WEBSOCKET_INPUT_SCHEMA'
                throw error
              }
            }

            const chain = []

            try
            {
              for(const path of [...(route.middleware || []), route.endpoint])
              {
                const 
                  Dispatcher = require(this.path.main.dirname + '/' + path),
                  dispatcher = new Dispatcher(this.locator, route, session, dto)

                chain.push(dispatcher)
              }
            }
            catch(previousError) 
            {
              const error = new Error('could not instanciate the endpoint')
              error.chain = { previousError, route, dto }
              error.code  = 'E_WEBSOCKET_ENDPOINT_INSTANCIATE'
              throw error
            }
    
            try
            {
              await this.dispatcherChain.dispatch(chain)
            }
            catch(previousError) 
            {
              const error = new Error('could not dispatch the endpoint')
              error.chain = { previousError, route, dto }
              error.code  = 'E_WEBSOCKET_ENDPOINT_DISPATCH'
              throw error
            }
          }
          catch(error)
          {
            await session.emit('websocket.server.error', error)
            session.socket.destroy()
          }
        })
      }
      else
      {
        this.deepmerge.mergeInclusive(inheritedRoute, this.routes[routeKey])
      }
    }
  }

  listen(port)
  {
    this.websocket.server.listen({ port })
  }
}

module.exports = Server
