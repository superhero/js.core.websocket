describe('websocket integration tests', async () =>
{
  const
  expect    = require('chai').expect,
  context   = require('mochawesome/addContext'),
  core      = require('@superhero/core'),
  WsClient  = require('@superhero/websocket/client'),
  routes    =
  [
    {
      endpoint  : 'controller/reflect',
      policy    : 'reflect'
    },
    {
      endpoint  : 'controller/multi',
      policy    : 'multi'
    },
    {
      chain     : 'controller/middleware',
      endpoint  : 'controller/obj',
      policy    : 'middleware'
    },
    {
      endpoint  : 'controller/not-implemented',
      policy    : 'not-implemented'
    }
  ]

  let server, client

  beforeEach(function(done)
  {
    const
    bootstrap = require('../bootstrap'),
    port      = 9001
    context(this, { title:'routes', value:routes })
    core.bootstrap(bootstrap).then((core) =>
    {
      const debug = false
      client = new WsClient({ debug })
      server = core.server('websocket', routes, { debug })
      server.on('listening', async () =>
      {
        await client.connect(port)
        done()
      })
      server.listen(port)
    })
  })

  afterEach(() =>
  {
    client.socket.end()
    server.close()
  })

  it('websocket responding', (done) =>
  {
    const
    evt   = 'reflect',
    data  = 'foobar'
    client.events.on(evt, (dto) =>
    {
      expect(dto).to.be.equal(data)
      done()
    })
    client.emit(evt, data)
  })

  it('websocket responding with multiple responses', (done) =>
  {
    const evt = 'multi'
    let i = 0
    client.events.on(evt, (dto) =>
    {
      ++i === 3
      && done()
    })
    client.emit(evt)
  })

  it('websocket middleware works as expected', (done) =>
  {
    const evt = 'middleware'
    client.events.on(evt, (dto) =>
    {
      expect(dto.wentThroughMddleware).to.be.equal(true)
      done()
    })
    client.emit(evt)
  })

  it('websocket not implemented response with an error', (done) =>
  {
    client.events.on('error', (dto) => done())
    client.emit('not-implemented')
  })
})
