const
root = require.main.exports.root,
Dispatcher = require(`${root}/dispatcher`)

module.exports = class extends Dispatcher
{
  dispatch()
  {
    this.session.emit(this.input.event, { foo:'bar' })
  }
}
