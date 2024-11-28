import { FastifyInstance } from 'fastify'
import { createProductHandler, getProductsHandler } from './product.controller'
import { $ref } from './product.schema'

async function productRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      preHandler: [fastify.authenticate],
      schema: {
        body: $ref('createProductSchema'),
        response: {
          201: $ref('productResponseSchema')
        },
        description: 'Create product',
        tags: ['product'],
        summary: 'Create a new product',
        params: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'product title'
            },
            price: {
              type: 'number',
              description: 'price of the product'
            },
            content: {
              type: 'string',
              description: 'text about the product'
            }
          }
        }
      }
    },
    createProductHandler
  )

  fastify.get(
    '/',
    {
      schema: {
        response: {
          201: $ref('productsResponseSchema')
        },
        description: 'Get all products',
        tags: ['product'],
        summary: 'Retrive all products from the database'
      }
    },
    getProductsHandler
  )
}

export default productRoutes
