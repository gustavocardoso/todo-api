import { db } from '../../utils/prisma'
import { CreateTodoInput, DeleteTodoInput, UpdateTodoInput } from './todo.schema'

export async function createTodo(data: CreateTodoInput & { userId: string }) {
  return await db.todo.create({
    data
  })
}

export async function updateTodo(data: UpdateTodoInput) {
  const { id, ...updatedData } = data
  return await db.todo.update({
    data: updatedData,
    where: {
      id: data.id
    }
  })
}

export async function deleteTodo(data: DeleteTodoInput) {
  const { id } = data
  return await db.todo.delete({
    where: {
      id
    }
  })
}

export async function getTodo(id: string) {
  return await db.todo.findUnique({
    where: {
      id
    }
  })
}

export async function getTodos() {
  return await db.todo.findMany({
    orderBy: {
      createdAt: 'asc'
    }
  })
}
