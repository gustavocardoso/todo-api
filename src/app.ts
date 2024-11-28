import fCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fjwt from '@fastify/jwt'
import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { UserPayload } from '../global'
import productRoutes from './modules/product/product.route'
import { productSchemas } from './modules/product/product.schema'
import TodoRoutes from './modules/todo/todo.route'
import { todoSchemas } from './modules/todo/todo.schema'
import userRoutes from './modules/user/user.route'
import { userSchemas } from './modules/user/user.schema'

const fastify = Fastify()

fastify.register(cors, {
  // during development
  origin: ['http://localhost:5000'],
  // for production
  // origin: ['http://my-awesome-site.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
})

fastify.register(fjwt, {
  secret: process.env.JWT_SECRET || 'R-pmxJ:|RM.?lM24jP2{fGVlDM4.R(.G4+[-.lo(pb{oc97EHMJ8E*X}lHRm8-'
})

fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  const token = request.cookies.access_token

  if (!token) {
    return reply.status(401).send({ message: 'Authentication required!' })
  }

  try {
    const decoded = request.jwt.verify<UserPayload>(token)
    request.user = decoded
  } catch (err) {
    return reply.status(401).send({ message: 'Invalid token' })
  }
})

fastify.addHook('preHandler', (req, res, next) => {
  req.jwt = fastify.jwt
  return next()
})

fastify.register(fCookie, {
  secret: process.env.COOKIE_SECRET || 'jksdfdfddsf8dsf5dsfds3fdsfdfdsi>:LK',
  hook: 'preHandler'
})

async function main() {
  for (const schema of [...userSchemas, ...productSchemas, ...todoSchemas]) {
    fastify.addSchema(schema) // should be add these schemas before you register your routes
  }

  await fastify.register(require('@fastify/swagger'))
  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'Fastify Prisma Rest API',
        description: 'A REST API built with Fastify, Prisma and TypeScript',
        version: '1.0.0',
        contact: {
          name: 'Gustavo Cardoso',
          url: 'https://gustavocardoso.me',
          email: 'gustavocardoso@gmail.com'
        }
      },
      externalDocs: {
        url: 'https://github.com/imvinojanv/fastify-prisma-rest-api',
        description: 'Fastify Tutorial source code is on GitHub'
      },
      host: '0.0.0.0:3000',
      basePath: '/',
      schemed: ['http', 'https'],
      consumes: ['application/json'],
      prodeuces: ['application/json']
    },
    uiconfig: {
      docExpansion: 'none',
      deepLinking: true
    },
    staticCSP: false,
    transformStaticCSP: (header: any) => header,
    exposeRoute: true
  })

  await fastify.register(userRoutes, { prefix: 'api/users' })
  await fastify.register(productRoutes, { prefix: 'api/products' })
  await fastify.register(TodoRoutes, { prefix: 'api/todos' })

  // Executes Swagger
  fastify.ready(err => {
    if (err) throw err
    fastify.swagger()
  })

  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
    console.log('Server listening at http://localhost:3000')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
