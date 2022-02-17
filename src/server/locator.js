const
  SuperheroWebsocket  = require('@superhero/websocket'),
  Server              = require('.'),
  LocatorConstituent  = require('superhero/core/locator/constituent')

/**
 * @memberof Websocket
 */
class ServerLocator extends LocatorConstituent
{
  /**
   * @returns {Server}
   */
  locate()
  {
    const
      configuration = this.locator.locate('core/configuration'),
      schema        = this.locator.locate('core/schema/composer'),
      options       = configuration.find('websocket/gateway'),
      routes        = configuration.find('websocket/routes'),
      path          = this.locator.locate('core/path'),
      websocket     = new SuperheroWebsocket(options)

    return new Server(websocket, routes, schema, path, this.locator)
  }
}

module.exports = ServerLocator