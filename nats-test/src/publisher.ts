import nats from 'node-nats-streaming'

console.clear()

const stan = nats.connect('gitix-dev', 'publisher_id', {
  url: 'http://localhost:4222' // connection url
})

stan.on('connect', () => {
  console.log('Publisher connected to NATS')

  // Message
  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20
  })

  setInterval(() => {
    stan.publish('ticket:created', data, () => {
      console.log('Event published')
    })
  }, 5000)
})


