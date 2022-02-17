/**
 * @memberof Websocket
 */
class Server
{
  constructor(websocket, routes, schema, path, locator)
  {
    this.websocket  = websocket
    this.routes     = routes
    this.schema     = schema
    this.path       = path
    this.locator    = locator
  }

  bootstrap()
  {
    for(const routeKey in this.routes || {})
    {
      const route = this.routes[routeKey]

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
  
          let endpoint
  
          try
          {
            const Endpoint = require(this.path.main.dirname + '/' + route.endpoint)
            endpoint = new Endpoint(this.locator, route, session, dto)
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
            await endpoint.dispatch()
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
  }

  listen(port)
  {
    this.websocket.server.listen({ port })
  }
}

module.exports = Server
