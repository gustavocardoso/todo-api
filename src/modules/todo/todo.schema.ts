import { buildJsonSchemas } from 'fastify-zod'
import * as z from 'zod'

const todoInput = {
  title: z.string({
    required_error: 'Title is required!'
  })
}

const updateTodoInput = {
  id: z.string().optional(),
  title: z.string({
    required_error: 'Title is required!'
  }),
  completed: z.boolean().default(false)
}

const todoGenerated = {
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
}

const createTodoSchema = z.object({
  ...todoInput
})

const updateTodoSchema = z.object({
  ...updateTodoInput
})

const deleteTodoSchema = z.object({
  id: z.string()
})

const deletedTodoResponseSchema = z.object({
  id: z.string()
})

const updateTodoParams = z.object({
  id: z.string()
})

const deleteTodoParams = updateTodoParams

const todoResponseSchema = z.object({
  ...todoInput,
  ...todoGenerated
})

const todosResponseSchema = z.array(todoResponseSchema)

export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
export type DeleteTodoInput = z.infer<typeof deleteTodoSchema>
export type UpdateTodoURLParams = z.infer<typeof updateTodoParams>
export type DeleteTodoURLParams = z.infer<typeof deleteTodoParams>

export const { schemas: todoSchemas, $ref } = buildJsonSchemas(
  {
    createTodoSchema,
    todoResponseSchema,
    todosResponseSchema,
    updateTodoSchema,
    updateTodoParams,
    deleteTodoSchema,
    deletedTodoResponseSchema
  },
  {
    $id: 'todoSchemas'
  }
)
