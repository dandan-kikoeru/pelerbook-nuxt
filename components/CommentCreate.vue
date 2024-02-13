<script lang="ts" setup>
const { user } = useAuthStore()
const { postId } = defineProps<{ postId: string }>()
const textarea = ref<HTMLElement | null>(null)
const form = reactive({
  content: '',
})

const handleTextarea = () => {
  if (textarea.value) {
    textarea.value.style.height = '1rem'
    textarea.value.style.height = `${textarea.value.scrollHeight}px`
  }
}

const isEmpty = computed(() => /^\s*$/.test(form.content))

const peerSelected = ref(false)
const el = ref(null)
const peer = () => {
  peerSelected.value = true
}
onClickOutside(el, () => (peerSelected.value = false))
const { isFetching, createComment } = useComment()
const submit = async () => {
  try {
    await createComment(form, postId)
    form.content = ''
  } catch (error: any) {
    console.error(error.response.data.message)
  }
}

defineExpose({
  textarea,
  peer,
})
</script>

<template>
  <div class="flex gap-2 mt-2">
    <div class="bg-neutral rounded-xl gap-2">
      <NuxtLink :to="`${user?.id}`" tabindex="0" class="avatar flex">
        <div class="rounded-full cursor-pointer w-10">
          <img :src="user?.avatar" />
        </div>
      </NuxtLink>
    </div>
    <div class="bg-accent rounded-2xl w-full" ref="el">
      <form @submit.prevent="submit()">
        <textarea
          ref="textarea"
          v-model="form.content"
          class="bg-transparent outline-none py-2 px-4 w-full rounded-2xl resize-none h-10"
          placeholder="Write a comment..."
          @input="handleTextarea()"
          @click="peer()"
          @keydown.enter.exact.prevent="submit()"
        />
        <div
          class="relative overflow-hidden duration-200"
          :class="peerSelected ? 'py-6' : ''"
        >
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
</template>
