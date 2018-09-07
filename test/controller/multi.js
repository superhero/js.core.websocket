const
root = require.main.exports.root,
Dispatcher = require(`${root}/dispatcher`)

module.exports = class extends Dispatcher
{
  async dispatch()
  {
    await this.session.emit(this.input.event)
    await this.session.emit(this.input.event)
    await this.session.emit(this.input.event)
  }
}
