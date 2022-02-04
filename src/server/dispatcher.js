/**
 * @memberof Websocket
 */
class ServerDispatcher
{
  constructor(route, session, dto)
  {
    this.route    = route
    this.session  = session
    this.dto      = dto
  }

  dispatch()
  {
    const error = new Error('the "dispatch" method is not implemented')
    error.chain = { route:this.route, dto:this.dto }
    error.code  = 'E_WEBSOCKET_DISPATCH'
    throw error
  }

  onError(error)
  {
    throw error
  }
}

module.exports = ServerDispatcher