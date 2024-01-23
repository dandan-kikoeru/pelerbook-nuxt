<script setup lang="ts">
const emit = defineEmits()
const editPostEl = ref(null)
const { isFetching, editPost } = usePost()
import type { Form, Post } from '~/types'

onClickOutside(editPostEl, () => emit('close'))

useEventListener(document, 'keydown', (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
})

const { data, index: postIndex } = defineProps<{
  data: Post
  index: any
}>()
const form: Form = reactive({
  caption: data.caption,
  image: data.image,
})

const submit = async () => {
  await editPost(form, postIndex, data)
  await emit('close')
}
const handleTextarea = () => {
  const textarea: any = document.querySelector('textarea')
  textarea.style.height = 'auto'
  textarea.style.height = `${textarea.scrollHeight}px`
}
const fileInput = ref<any>(null)
const imagePreviewUrl = ref<string | null>(null)
const handleFileInput = () => {
  if (
    !['image/png', 'image/jpeg', 'image/webp'].includes(
      fileInput.value?.files[0].type,
    )
  ) {
    return console.error('File format not supported')
  }

  form.image = fileInput.value?.files[0]
  imagePreviewUrl.value = URL.createObjectURL(form.image)
}

const openFileInput = () => {
  fileInput.value.click()
}

const handleRemoveFile = () => {
  form.image = ''
  imagePreviewUrl.value = ''
}

onMounted(() => {
  document.body.classList.add('overflow-hidden', 'mr-4')
  document.body.classList.remove('overflow-y-scroll')
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
    <div class="card-body gap-4 py-4">
      <form @submit.prevent="submit">
        <div class="flex gap-4 flex-col">
          <div class="overflow-y-auto max-h-96">
            <textarea
              v-model="form.caption"
              :placeholder="`What's on your mind, ${data.user.firstname}`"
              class="w-full bg-transparent outline-none resize-none"
              @input="handleTextarea()"
            />
            <div v-if="imagePreviewUrl" class="relative m-4">
              <div
                class="absolute btn btn-circle btn-accent text-2xl btn-sm right-2 top-2"
                @click="handleRemoveFile"
              >
                <IconsClose />
              </div>
              <img :src="imagePreviewUrl" class="rounded-xl w-full" />
            </div>
          </div>
          <div
            class="btn btn-ghost btn-circle text-2xl"
            @click="openFileInput"
            v-if="!imagePreviewUrl"
          >
            <IconsPhoto />
          </div>
          <input
            type="file"
            ref="fileInput"
            @change="handleFileInput"
            accept=".jpg, .jpeg, .png, .webp"
            class="hidden"
          />
        </div>
        <button
          class="btn btn-secondary normal-case btn-block mx-auto mt-2"
          :disabled="isFetching"
        >
          Edit
        </button>
      </form>
    </div>
  </div>
</template>
