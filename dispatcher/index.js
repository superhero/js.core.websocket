const ERR_NOT_IMPLEMENTED = require('./error/not-implemented')

module.exports = class
{
  constructor(input, route, session, locator)
  {
    this.input    = input
    this.route    = route
    this.session  = session
    this.locator  = locator
  }

  * dispatch()
  {
    throw new ERR_NOT_IMPLEMENTED
  }
}
