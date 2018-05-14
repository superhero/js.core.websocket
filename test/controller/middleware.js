const
root = require.main.exports.root,
Dispatcher = require(`${root}/dispatcher`)

module.exports = class extends Dispatcher
{
  * dispatch(next)
  {
    for(const [event, data, toAll] of next())
    {
      data.wentThroughMddleware = true
      yield [event, data, toAll]
    }
  }
}
