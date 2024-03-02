<script setup lang="ts">
const emit = defineEmits()
const editPostEl = ref(null)
const textareaEl = ref<null | HTMLElement>(null)
const fileInputEl = ref<null | HTMLElement>(null)

const { isFetching, editPost } = usePost()
import type { Post } from '~/types'

onClickOutside(editPostEl, (e) => emit('close'))

useEventListener(document, 'keydown', (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
})

const { post } = defineProps<{
  post: Post
}>()

const form: { caption: string; image: string | Blob } = reactive({
  caption: decodeHTML(post.caption),
  image: post.image,
})
const isEmpty = computed(() => /^\s*$/.test(form.caption) && !form.image)

const submit = async () => {
  if (!isEmpty.value) {
    await editPost(form, post.id)
    await emit('close')
  }
}
const handleTextarea = () => {
  if (textareaEl.value) {
    textareaEl.value.style.height = 'auto'
    textareaEl.value.style.height = `${textareaEl.value.scrollHeight}px`
  }
}
const imagePreviewUrl = ref<string | null>(null)
const handleFileInput = () => {
  if (
    fileInputEl.value instanceof HTMLInputElement &&
    fileInputEl.value.files
  ) {
    const selectedFile: Blob = fileInputEl.value.files[0]

    if (
      !['image/png', 'image/jpeg', 'image/webp'].includes(selectedFile.type)
    ) {
      return console.error('File format not supported')
    }

    form.image = selectedFile
    imagePreviewUrl.value = URL.createObjectURL(selectedFile)
  }
}

const openfileInputEl = () => {
  fileInputEl.value ? fileInputEl.value.click() : -1
}

const handleRemoveFile = () => {
  form.image = ''
  imagePreviewUrl.value = ''
}

if (post.image) {
  imagePreviewUrl.value = post.image
}

onMounted(async () => {
  document.body.classList.add('overflow-hidden', 'mr-4')
  document.body.classList.remove('overflow-y-scroll')
  if (textareaEl.value) {
    await nextTick()
    textareaEl.value.focus()
    handleTextarea()
  }
})

onUnmounted(() => {
  document.body.classList.remove('overflow-hidden', 'mr-4')
  document.body.classList.add('overflow-y-scroll')
})
</script>
<template>
  <div class="card w-[28rem] bg-neutral shadow-xl" ref="editPostEl">
    <div class="border-b py-6 border-accent flex justify-between">
      <div class="px-6 font-bold text-2xl w-full text-center">Edit Post</div>
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
              :placeholder="`What's on your mind, ${post.user.firstName}`"
              class="w-full bg-transparent outline-none resize-none pl-4"
              @input="handleTextarea()"
              @keydown.enter.exact.prevent="submit"
            />
            <template v-if="!post.shared">
              <div v-if="imagePreviewUrl" class="relative m-4">
                <div
                  class="absolute btn btn-circle btn-accent text-2xl btn-sm right-2 top-2"
                  @click="handleRemoveFile"
                >
                  <IconsClose />
                </div>
                <img :src="imagePreviewUrl" class="rounded-xl w-full" />
              </div>
              <div
                class="btn btn-ghost btn-circle text-2xl"
                @click="openfileInputEl"
                v-if="!imagePreviewUrl"
              >
                <IconsPhoto />
              </div>
              <input
                type="file"
                ref="fileInputEl"
                @change="handleFileInput"
                accept=".jpg, .jpeg, .png, .webp"
                class="hidden"
              />
            </template>
            <template v-else-if="post.shared">
              <div
                class="pointer-events-none border border-accent m-4 rounded-xl"
              >
                <PostShare :post="post.shared" />
              </div>
            </template>
          </div>
        </NuxtScrollbar>
        <button
          class="btn btn-primary normal-case btn-block mx-auto mt-4"
          :disabled="isFetching || isEmpty"
        >
          Edit
        </button>
      </form>
    </div>
  </div>
</template>
