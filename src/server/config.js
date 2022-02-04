/**
 * @namespace Websocket.Server
 */
module.exports =
{
  core:
  {
    bootstrap:
    {
      'websocket' : 'websocket/server'
    },
    locator:
    {
      'websocket/server' : __dirname
    }
  },
  websocket:
  {
    gateway:
    {
      debug:true 
    }
  }
}
