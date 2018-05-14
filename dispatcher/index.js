const ERR_NOT_IMPLEMENTED = require('./error/not-implemented')

module.exports = class
{
  constructor(input, route, session)
  {
    this.input    = input
    this.route    = route
    this.session  = session
  }

  * dispatch()
  {
    throw new ERR_NOT_IMPLEMENTED
  }
}
