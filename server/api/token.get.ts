import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // Persist a minimal user session
  await clearUserSession(event)
  return sendRedirect(event, '/')
})
