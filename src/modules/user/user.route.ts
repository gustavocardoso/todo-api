import { FastifyInstance } from 'fastify'
import { getUserhandler, loginHandler, logoutHandler, registerUserHandler } from './user.controller'
import { $ref } from './user.schema'

async function userRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      schema: {
        body: $ref('createUserSchema'),
        response: {
          201: $ref('createUserResponseSchema')
        },
        description: 'Create user',
        tags: ['user'],
        summary: 'Create a new user',
        params: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'user email'
            },
            name: {
              type: 'string',
              description: 'name of the user'
            },
            password: {
              type: 'string',
              description: 'user password'
            }
          }
        }
      }
    },
    registerUserHandler
  )

  fastify.post(
    '/login',
    {
      schema: {
        body: $ref('loginSchema'),
        response: {
          201: $ref('loginResponseSchema')
        },
        description: 'User login',
        tags: ['user'],
        summary: 'User login using email and password',
        params: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'user email'
            },
            password: {
              type: 'string',
              description: 'user password'
            }
          }
        }
      }
    },
    loginHandler
  )

  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Get all users',
        tags: ['user'],
        summary: 'Retrive all users from the database'
      }
    },
    getUserhandler
  )

  fastify.delete(
    '/logout',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Delete user',
        tags: ['user'],
        summary: 'Delete user by id',
        params: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'user id'
            }
          }
        }
      }
    },
    logoutHandler
  )
}

export default userRoutes
