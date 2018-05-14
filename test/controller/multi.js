const
root = require.main.exports.root,
Dispatcher = require(`${root}/dispatcher`)

module.exports = class extends Dispatcher
{
  * dispatch()
  {
    yield [this.input.event]
    yield [this.input.event]
    yield [this.input.event]
  }
}
