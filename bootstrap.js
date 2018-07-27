module.exports = async function(config)
{
  const config = await this.locator.load('config')

  config.server.ws         = __dirname
  config.server.websocket  = __dirname
}
