<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFetch } from 'nuxt/app'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/valibot'
import { object, string, minLength, pipe } from 'valibot'
import { onClickOutside } from '@vueuse/core'

// Protect this page: require authentication
definePageMeta({ middleware: 'auth' })

// Current user (for avatar in header)
const { user } = useUserSession()

// Avatar dropdown state
const menuRef = ref<HTMLElement | null>(null)
const showMenu = ref(false)
onClickOutside(menuRef, () => {
  showMenu.value = false
})

function logout() {
  // Use full-page redirect to server API route to clear cookie session
  window.location.href = '/api/token'
}

const {
  handleSubmit,
  values,
  defineField,
  errors,
  isSubmitting,
  resetForm,
} = useForm({
  validationSchema: toTypedSchema(
    object({
      title: pipe(string('请输入任务标题'), minLength(1, '标题不能为空')),
    }),
  ),
})

const [title] = defineField('title')

// Load todos on server-side
const { data, refresh, pending } = await useFetch<{
  todos: Array<{ id: number, title: string, completed: boolean }>
}>('/api/todos', {
  default: () => ({ todos: [] }),
})

const todos = computed(() => data.value?.todos ?? [])

const onSubmit = handleSubmit(
  async (vals) => {
    console.log(vals)
    await $fetch('/api/todos', {
      method: 'POST',
      body: { title: vals.title },
    })
    resetForm()
    await refresh()
  },
  (errors) => {
    console.log(errors, values)
  },
)

async function toggleTodo(id: number) {
  await $fetch(`/api/todos/${id}`, { method: 'PATCH' })
  await refresh()
}

async function deleteTodo(id: number) {
  await $fetch(`/api/todos/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>

<template>
  <div class="mx-auto max-w-xl p-6">
    <!-- Header with title (left) and avatar (right) -->
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-2xl font-700">
        Todo List
      </h1>
      <div
        ref="menuRef"
        class="relative"
      >
        <button
          class="h-9 w-9 rounded-full overflow-hidden border flex items-center justify-center bg-gray-100 focus:outline-none"
          @click="showMenu = !showMenu"
        >
          <img
            v-if="user?.image"
            :src="user?.image"
            alt="avatar"
            class="h-full w-full object-cover"
          >
          <span
            v-else
            class="text-xs text-gray-500"
          >
            {{ (user?.name || 'U').charAt(0).toUpperCase() }}
          </span>
        </button>
        <div
          v-if="showMenu"
          class="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow-lg z-50"
        >
          <div class="px-3 py-2 text-sm text-gray-700 truncate">
            {{ user?.name || '用户' }}
          </div>
          <button
            class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
            @click="logout"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>

    <form
      class="flex gap-3 mb-6"
      @submit.prevent="onSubmit"
    >
      <Input
        v-model="title"
        type="text"
        placeholder="添加一个待办..."
        class="flex-1"
      />
      <Button
        type="submit"
        :disabled="isSubmitting"
      >
        添加
      </Button>
    </form>
    <p
      v-if="errors.title"
      class="text-red-600 mb-3 text-sm"
    >
      {{ errors.title }}
    </p>

    <div
      v-if="pending"
      class="text-gray-500"
    >
      加载中...
    </div>
    <ul
      v-else
      class="space-y-3"
    >
      <li
        v-for="t in todos"
        :key="t.id"
      >
        <Card>
          <CardContent class="p-3">
            <div class="flex items-center gap-3">
              <Checkbox
                :model-value="t.completed"
                @update:model-value="() => toggleTodo(t.id)"
              />
              <span
                :class="t.completed ? 'line-through text-gray-500' : ''"
                class="flex-1"
              >{{ t.title }}</span>
              <Button
                variant="destructive"
                size="sm"
                @click="deleteTodo(t.id)"
              >
                删除
              </Button>
            </div>
          </CardContent>
        </Card>
      </li>
    </ul>

    <p
      v-if="!pending && todos.length === 0"
      class="text-gray-500"
    >
      暂无待办，添加一个吧！
    </p>
  </div>
</template>

<style>
:root {
  --primary: #4f46e5;
}
</style>
