import { FastifyInstance } from 'fastify'
import {
  createTodoHandler,
  deleteTodoHandler,
  getTodosHandler,
  updateTodoHandler
} from './todo.controller'
import { $ref } from './todo.schema'

async function TodoRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: $ref('createTodoSchema'),
        response: {
          201: $ref('todoResponseSchema')
        },
        description: 'Create todo',
        tags: ['todo'],
        summary: 'Create a new todo',
        params: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'todo title'
            },
            status: {
              type: 'boolean',
              description: 'todo status - default: false'
            }
          }
        }
      }
    },
    createTodoHandler
  )

  fastify.put(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: $ref('updateTodoSchema'),
        response: {
          201: $ref('todoResponseSchema')
        },
        description: 'Update todo',
        tags: ['todo'],
        summary: 'Update a todo info'
      }
    },
    updateTodoHandler
  )

  fastify.delete(
    '/:id',
    {
      preHandler: [fastify.authenticate],
      schema: {
        response: {
          201: $ref('deletedTodoResponseSchema')
        },
        description: 'Delete todo',
        tags: ['todo'],
        summary: 'Delete a todo'
      }
    },
    deleteTodoHandler
  )

  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        description: 'Get all todos',
        tags: ['todo'],
        summary: 'Retrive all todos from the database'
      }
    },
    getTodosHandler
  )
}

export default TodoRoutes
