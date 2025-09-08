import { defineEventHandler } from 'h3'
import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async () => {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return { todos }
})
