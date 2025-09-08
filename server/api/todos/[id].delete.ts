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

  await prisma.todo.delete({ where: { id } })
  return { success: true }
})
