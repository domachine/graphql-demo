const fs = require('fs')
const util = require('util')
const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')

const readFileAsync = util.promisify(fs.readFile)

async function main() {
  const app = express()

  const schema = buildSchema(await readFileAsync('./schema.graphql', 'utf-8'))

  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      graphiql: true,
      rootValue: {
        User: () => {
          return {
            posts: [{ title: 'Whatever!' }]
          }
        },
        users: () => {
          return [
            {
              name: 'Max',
              email: 'max@penguin.digital'
            }
          ]
        },

        setUserName(vars) {
          console.log(vars.name)
        }
      }
    })
  )

  app.listen(4000)
}

process.on('unhandledRejection', err => {
  throw err
})
main()
