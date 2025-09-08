import { defineEventHandler, readBody } from 'h3'
import prisma from '../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ title?: string }>(event)
  const title = (body?.title ?? '').trim()
  if (!title) {
    return new Response(
      JSON.stringify({ error: 'Title is required' }),
      { status: 400, headers: { 'content-type': 'application/json' } },
    )
  }
  const todo = await prisma.todo.create({ data: { title } })
  return { todo }
})
