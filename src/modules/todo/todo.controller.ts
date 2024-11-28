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
  const todo = await createTodo(request.body)
  return todo
}

export async function updateTodoHandler(
  request: FastifyRequest<{ Body: UpdateTodoInput; Params: UpdateTodoURLParams }>,
  reply: FastifyReply
) {
  const { title, completed } = request.body
  const { id } = request.params
  const existingTodo = await getTodo(id)

  if (!existingTodo) {
    return reply.code(404).send({ message: 'Todo not found!' })
  }

  const todo = await updateTodo({ id, title, completed })
  return todo
}

export async function getTodosHandler() {
  const todos = await getTodos()
  return todos
}

export async function deleteTodoHandler(
  request: FastifyRequest<{ Params: DeleteTodoURLParams }>,
  reply: FastifyReply
) {
  const { id } = request.params
  const existingTodo = await getTodo(id)

  if (!existingTodo) {
    return reply.code(404).send({ message: 'Todo not found!' })
  }

  const deletedTodo = await deleteTodo({ id })
  return { id }
}
