<script lang="ts" setup>
import type { Comment } from '~/types'
const { user } = useAuthStore()
const { comment, index } = defineProps<{ comment: Comment; index: number }>()
const emit = defineEmits()
const textarea = ref<HTMLElement | null>(null)
const form = reactive({
  content: comment.content,
})

const handleTextarea = () => {
  if (textarea.value) {
    textarea.value.style.height = '1rem'
    textarea.value.style.height = `${textarea.value.scrollHeight}px`
  }
}

const isEmpty = computed(() => /^\s*$/.test(form.content))

const { isFetching, editComment } = useComment()
const submit = async () => {
  try {
    await editComment(form, comment, index)
    emit('close')
  } catch (error: any) {
    console.error(error.response.data.message)
  }
}

defineExpose({
  textarea,
})
useEventListener(document, 'keydown', (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
})
onMounted(() => {
  handleTextarea()
})
</script>

<template>
  <div>
    <div class="flex gap-1 mt-2 w-full">
      <NuxtLink
        :to="`/${comment.user.id}`"
        class="btn btn-ghost btn-circle avatar"
      >
        <div class="w-10 rounded-full">
          <img :src="comment.user.avatar" />
        </div>
      </NuxtLink>
      <div class="flex w-full items-center">
        <div class="bg-[#3a3b3c] rounded-2xl w-full">
          <form @submit.prevent.default="submit">
            <textarea
              ref="textarea"
              v-model="form.content"
              class="bg-transparent outline-none py-2 px-4 w-full rounded-2xl resize-none h-10"
              placeholder="Write a comment..."
              @input="handleTextarea"
              @keydown.enter.exact.prevent="submit"
            />
            <div class="relative overflow-hidden py-6">
              <button
                class="absolute btn btn-circle btn-ghost disabled:bg-transparent text-primary disabled:cursor-not-allowed text-2xl right-0 top-0"
                :disabled="isFetching || isEmpty"
              >
                <IconsSend />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="ml-12 text-sm">
      Press escape to
      <span
        class="text-primary text-sm hover:underline cursor-pointer"
        @click="emit('close')"
        >cancel</span
      >
    </div>
  </div>
</template>
