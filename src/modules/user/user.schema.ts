import { buildJsonSchemas } from 'fastify-zod'
import * as z from 'zod'

const userCore = {
  email: z
    .string({
      required_error: 'Email is required!',
      invalid_type_error: 'Email is not valid!'
    })
    .email(),
  name: z.string()
}

const createUserSchema = z.object({
  ...userCore,
  password: z.string({
    required_error: 'Password is required!'
  })
})

const createUserResponseSchema = z.object({
  id: z.number(),
  ...userCore
})

export type CreateUserInput = z.infer<typeof createUserSchema>

const loginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required!',
      invalid_type_error: 'Email is not valid!'
    })
    .email(),
  password: z.string()
})

const loginResponseSchema = z.object({
  accessToken: z.string()
})

export type LoginInput = z.infer<typeof loginSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas(
  {
    createUserSchema,
    createUserResponseSchema,
    loginSchema,
    loginResponseSchema
  },
  {
    $id: 'userSchema'
  }
)
