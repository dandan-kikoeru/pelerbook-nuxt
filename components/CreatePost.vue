<script setup lang="ts">
import axios from 'axios'
const emit = defineEmits()
const createPost = ref(null)

onClickOutside(createPost, () => emit('close'))

useEventListener(document, 'keydown', (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
})

const captionStore = useCaptionStore()
const form = reactive({
  caption: captionStore.caption,
})
const { getBearer } = useAuthStore()
const index = useIndexStore()

const fetching = ref<boolean>(false)
const submit = async () => {
  try {
    fetching.value = true
    const response: any = await axios.post('/api/post/store', form, {
      headers: {
        Authorization: getBearer,
      },
    })
    await index.unshiftPosts(response.data)
    await emit('close')
    await captionStore.setCaption()
  } catch (error: any) {
    console.error(error)
  } finally {
    fetching.value = false
  }
}
const handleTextarea = () => {
  const textarea: any = document.querySelector('textarea')
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
  captionStore.setCaption(form.caption)
}
onMounted(() => {
  document.body.classList.add('overflow-hidden', 'mr-[1vw]')
  document.body.classList.remove('overflow-y-scroll')
})

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden', 'mr-[1vw]')
  document.body.classList.add('overflow-y-scroll')
})

defineProps<{
  firstName: string | undefined
}>()
</script>
<template>
  <div class="card w-[28rem] bg-neutral shadow-xl" ref="createPost">
    <form @submit.prevent="submit">
      <div class="border-b py-6 border-accent flex justify-between">
        <div class="px-6 font-bold text-2xl w-full text-center">
          Create Post
        </div>
        <div
          @click="$emit('close')"
          class="btn btn-circle btn-accent btn-sm mr-4 cursor-pointer h-fit absolute right-1 text-2xl"
        >
          <IconsClose />
        </div>
      </div>
      <div class="card-body gap-4 py-4">
        <div class="flex gap-4">
          <textarea
            v-model="form.caption"
            :placeholder="`What's on your mind, ${firstName}`"
            class="w-full bg-transparent outline-none max-h-96 resize-none"
            @input="handleTextarea()"
          />
        </div>
        <button
          class="btn btn-secondary normal-case btn-block mx-auto mt-2"
          :disabled="fetching"
        >
          Post
        </button>
      </div>
    </form>
  </div>
</template>
