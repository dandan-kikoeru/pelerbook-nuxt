<script setup lang="ts">
const emit = defineEmits()
const sharePostEl = ref(null)
const textareaEl = ref<null | HTMLElement>(null)
const { user } = storeToRefs(useAuthStore())

const { isFetching, sharePost } = usePost()
import type { Post } from '~/types'

onClickOutside(sharePostEl, (e) => emit('close'))

useEventListener(document, 'keydown', (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
})

const { post } = defineProps<{
  post: Post
}>()

const form = reactive({
  caption: '',
})

const submit = async () => {
  await sharePost(form, post.id)
  await emit('close')
}
const handleTextarea = () => {
  if (textareaEl.value) {
    textareaEl.value.style.height = 'auto'
    textareaEl.value.style.height = `${textareaEl.value.scrollHeight}px`
  }
}

onMounted(() => {
  document.body.classList.add('overflow-hidden', 'mr-4')
  document.body.classList.remove('overflow-y-scroll')
  textareaEl.value ? textareaEl.value.focus() : ''
  handleTextarea()
})

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden', 'mr-4')
  document.body.classList.add('overflow-y-scroll')
})
</script>
<template>
  <div class="card w-[28rem] bg-neutral shadow-xl" ref="sharePostEl">
    <div class="border-b py-6 border-accent flex justify-between">
      <div class="px-6 font-bold text-2xl w-full text-center">Share Post</div>
      <div
        @click="$emit('close')"
        class="btn btn-circle btn-accent btn-sm mr-4 cursor-pointer h-fit absolute right-1 text-2xl"
      >
        <IconsClose />
      </div>
    </div>
    <div class="card-body -m-4">
      <form @submit.prevent="submit">
        <NuxtScrollbar>
          <div class="max-h-96">
            <textarea
              ref="textareaEl"
              v-model="form.caption"
              :placeholder="`What's on your mind, ${user?.firstname}`"
              class="w-full bg-transparent outline-none resize-none pl-4"
              @input="handleTextarea()"
              @keydown.enter.exact.prevent="submit"
            />
            <div
              class="pointer-events-none border border-accent m-4 rounded-xl"
            >
              <PostShare :post="post" />
            </div>
          </div>
        </NuxtScrollbar>
        <button
          class="btn btn-primary normal-case btn-block mx-auto mt-4"
          :disabled="isFetching"
        >
          Share
        </button>
      </form>
    </div>
  </div>
</template>
