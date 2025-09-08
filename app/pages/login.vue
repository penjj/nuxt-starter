<script setup lang="ts">
import { Button } from '@/components/ui/button'

const { loggedIn, fetch, openInPopup } = useUserSession()

// If already logged in, go to index
if (!import.meta.server) {
  // Ensure session is hydrated client-side
  await fetch()
  if (loggedIn.value) {
    navigateTo('/')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <h1 class="text-2xl font-700 mb-4">
        登录
      </h1>
      <p class="text-gray-600 mb-6">
        使用 GitHub 账号登录以继续
      </p>
      <div class="space-y-3">
        <Button
          class="w-full"
          @click="() => openInPopup('/auth/github')"
        >
          使用 GitHub 登录（弹窗）
        </Button>
        <p class="text-sm text-gray-500">
          或
        </p>
        <a
          class="underline text-primary"
          href="/auth/github"
        >
          直接跳转进行 GitHub 登录
        </a>
      </div>
    </div>
  </div>
</template>
