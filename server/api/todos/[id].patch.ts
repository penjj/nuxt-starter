import { defineEventHandler, getRouterParam } from 'h3'
import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)
  if (!Number.isInteger(id)) {
    return new Response(
      JSON.stringify({ error: 'Invalid id' }),
      { status: 400, headers: { 'content-type': 'application/json' } },
    )
  }

  const existing = await prisma.todo.findUnique({ where: { id } })
  if (!existing) {
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { 'content-type': 'application/json' } },
    )
  }

  const updated = await prisma.todo.update({
    where: { id },
    data: { completed: !existing.completed },
  })
  return { todo: updated }
})
