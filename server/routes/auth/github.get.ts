export default defineOAuthGitHubEventHandler({
  // You can pass provider-specific config here (optional)
  // e.g. config: { emailRequired: true }
  async onSuccess(event, { user, tokens: _tokens }) {
    // Persist a minimal user session
    await setUserSession(event, {
      user: {
        id: String(user.id),
        name: user.name || user.login || '',
        email: user.email || '',
        image: user.avatar_url || '',
      },
      loggedInAt: new Date().toISOString(),
      // You can store tokens in secure session if needed
      // secure: { tokens }
    })

    return sendRedirect(event, '/')
  },
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  },
})
