import fastify from 'fastify'

const app = fastify()

app.get('/hello', () => {
  return 'hello world'
})

app
  .listen({
    port: 3001,
  })
  .then(() => {
    console.log('listening on port 3001')
  })
