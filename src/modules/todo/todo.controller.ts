import { FastifyReply, FastifyRequest } from 'fastify'
import {
  CreateTodoInput,
  DeleteTodoInput,
  DeleteTodoURLParams,
  UpdateTodoInput,
  UpdateTodoURLParams
} from './todo.schema'
import { createTodo, deleteTodo, getTodo, getTodos, updateTodo } from './todo.service'

export async function createTodoHandler(
  request: FastifyRequest<{ Body: CreateTodoInput }>,
  reply: FastifyReply
) {
  const todo = await createTodo({
    ...request.body,
    userId: request.user.id
  })
  return todo
}

export async function updateTodoHandler(
  request: FastifyRequest<{ Body: UpdateTodoInput; Params: UpdateTodoURLParams }>,
  reply: FastifyReply
) {
  const { title, completed } = request.body
  const { id } = request.params
  const userId = request.user.id

  try {
    const existingTodo = await getTodo(id, userId)
    if (!existingTodo) {
      return reply.code(404).send({ message: 'Todo not found!' })
    }
  } catch (error) {
    console.log(error)
  }

  const todo = await updateTodo({ id, title, completed })
  return todo
}

export async function getTodosHandler(
  request: FastifyRequest<{ Querystring: { completed?: boolean | undefined; order: string } }>,
  reply: FastifyReply
) {
  const completed = request.query.completed as boolean
  const order = request.query.order
  const userId = request.user.id
  const todos = await getTodos(completed, order, userId)
  return todos
}

export async function deleteTodoHandler(
  request: FastifyRequest<{ Params: DeleteTodoURLParams }>,
  reply: FastifyReply
) {
  const { id } = request.params
  const userId = request.user.id
  const existingTodo = await getTodo(id, userId)

  if (!existingTodo) {
    return reply.code(404).send({ message: 'Todo not found!' })
  }

  const deletedTodo = await deleteTodo({ id })
  return { id }
}
