<script setup lang="ts">
import type { AxiosError } from '~/types'

const { $axios } = useNuxtApp()
const auth = useAuthStore()

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Pelerbook',
})

const form: { avatar: string | Blob; cover: string | Blob } = reactive({
  avatar: '',
  cover: '',
})
const { errors } = storeToRefs(useGeneralStore())
const isFetching = ref(false)
const submit = async () => {
  try {
    isFetching.value = true
    const response = await $axios.post('/api/user/update', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    await auth.setUser(response.data)
  } catch (e: unknown) {
    const { response } = e as AxiosError
    const { avatar = [], cover = [] } = response.data.errors
    errors.value = []
    errors.value.push(...avatar, ...cover)
  } finally {
    isFetching.value = false
    handleCancelPreview()
    errors.value = []
  }
}

const handleCancelPreview = () => {
  form.avatar = ''
  form.cover = ''
  avatarPreviewUrl.value = auth.user ? auth.user.avatar : ''
  coverPreviewUrl.value = auth.user ? auth.user.cover : ''
  resetEdit()
  isEditing.value = false
}
/**
 *  * AVATAR
 */

const avatarInputEl = ref<HTMLElement | null>(null)
const avatarPreviewUrl = ref<string>(auth.user ? auth.user.avatar : '')
const openAvatar = () => {
  avatarInputEl.value ? avatarInputEl.value.click() : -1
}
const handleAvatarInput = () => {
  if (
    avatarInputEl.value instanceof HTMLInputElement &&
    avatarInputEl.value.files
  ) {
    handleCancelPreview()
    const selectedFile: Blob = avatarInputEl.value.files[0]
    if (
      !['image/png', 'image/jpeg', 'image/webp'].includes(selectedFile.type)
    ) {
      return errors.value.push(
        'The avatar field must be a file of type: jpeg, png, jpg, webp.',
      )
    }
    form.avatar = selectedFile
    avatarPreviewUrl.value = URL.createObjectURL(selectedFile)
  }
}

/**
 *  * COVER
 */

const coverInputEl = ref<null | HTMLElement>(null)
const coverPreviewUrl = ref<string>(auth.user ? auth.user.cover : '')
const openCover = () => {
  coverInputEl.value ? coverInputEl.value.click() : -1
}
const handleCoverInput = () => {
  if (
    coverInputEl.value instanceof HTMLInputElement &&
    coverInputEl.value.files
  ) {
    handleCancelPreview()
    const selectedFile: Blob = coverInputEl.value.files[0]
    if (
      !['image/png', 'image/jpeg', 'image/webp'].includes(selectedFile.type)
    ) {
      return errors.value.push(
        'The cover field must be a file of type: jpeg, png, jpg, webp.',
      )
    }
    form.cover = selectedFile
    coverPreviewUrl.value = URL.createObjectURL(selectedFile)
  }
}

/**
 *  * NAME
 **/

const isEditing = ref(false)
const toggleEdit = () => {
  !isEditing.value ? handleCancelPreview() : resetEdit()
  isEditing.value = !isEditing.value
}
const resetEdit = () => {
  formName.firstName = auth.user?.firstName
  formName.surname = auth.user?.surname
}

const submitName = async () => {
  try {
    isFetching.value = true
    const response = await $axios.post('/api/user/update', formName)
    auth.setUser(response.data)
    toggleEdit()
  } catch (e: unknown) {
    const { response } = e as AxiosError
    const { firstName = [], surname = [] } = response.data.errors
    errors.value = []
    errors.value.push(...firstName, ...surname)
  } finally {
    isFetching.value = false
    errors.value = []
  }
}
const formName = reactive({
  firstName: auth.user?.firstName,
  surname: auth.user?.surname,
})
</script>
<template>
  <div class="flex justify-center items-center min-h-screen flex-col">
    <div class="card w-96 md:w-[36rem] bg-neutral shadow-xl">
      <div class="card-body">
        <div class="flex w-full">
          <p class="text-lg font-bold">Profile picture</p>
          <button
            class="btn btn-ghost text-primary normal-case"
            @click="toggleEdit()"
          >
            Edit
          </button>
        </div>
        <form @submit.prevent="submitName">
          <div class="flex gap-4">
            <input
              name="firstName"
              type="text"
              placeholder="First name"
              class="input w-full max-w-xs bg-base-100"
              v-model="formName.firstName"
              :disabled="!isEditing"
            />
            <input
              name="surname"
              type="text"
              placeholder="Surname"
              class="input w-full max-w-xs bg-base-100"
              v-model="formName.surname"
              :disabled="!isEditing"
            />
          </div>
          <div v-if="isEditing" class="mt-4 flex justify-center">
            <div
              class="btn btn-ghost text-primary mr-2 btn-sm"
              @click="toggleEdit()"
            >
              Cancel
            </div>
            <button
              class="btn btn-primary text-white btn-sm w-24"
              :disabled="isFetching"
            >
              Save
            </button>
          </div>
        </form>
        <div class="flex flex-col items-center">
          <div class="flex w-full my-2">
            <p class="text-lg font-bold">Profile picture</p>
            <button
              class="btn btn-ghost text-primary normal-case"
              @click="openAvatar()"
            >
              Edit
            </button>
          </div>
          <label tabindex="0" class="avatar w-32">
            <div class="rounded-full cursor-pointer" @click="openAvatar()">
              <img :src="avatarPreviewUrl" />
            </div>
          </label>
          <form @submit.prevent="submit">
            <input
              type="file"
              ref="avatarInputEl"
              @change="handleAvatarInput"
              accept=".jpg, .jpeg, .png, .webp"
              class="hidden"
            />
            <div v-if="form.avatar" class="mt-4">
              <div
                class="btn btn-ghost text-primary mr-2 btn-sm"
                @click="handleCancelPreview"
              >
                Cancel
              </div>
              <button
                class="btn btn-primary text-white btn-sm w-24"
                :disabled="isFetching"
              >
                Save
              </button>
            </div>
          </form>
        </div>
        <div>
          <div class="flex w-full my-2">
            <p class="text-lg font-bold">Cover photo</p>
            <button
              class="btn btn-ghost text-primary normal-case"
              @click="openCover()"
            >
              Edit
            </button>
          </div>
          <div
            v-if="coverPreviewUrl"
            class="relative aspect-[3/1] max-w-6xl mx-auto overflow-hidden rounded-xl cursor-pointer"
            @click="openCover()"
          >
            <img class="object-cover w-full h-full" :src="coverPreviewUrl" />
          </div>
          <div
            v-else
            class="relative aspect-[3/1] max-w-6xl mx-auto overflow-hidden rounded-xl bg-black cursor-pointer"
            @click="openCover()"
          ></div>
          <form @submit.prevent="submit">
            <input
              type="file"
              ref="coverInputEl"
              @change="handleCoverInput"
              accept=".jpg, .jpeg, .png, .webp"
              class="hidden"
            />
            <div v-if="form.cover" class="mt-4 flex justify-center">
              <div
                class="btn btn-ghost text-primary mr-2 btn-sm"
                @click="handleCancelPreview"
              >
                Cancel
              </div>
              <button
                class="btn btn-primary text-white btn-sm w-24"
                :disabled="isFetching"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div class="toast toast-end z-10">
    <div
      class="alert alert-error flex justify-between"
      v-for="(error, index) in errors"
      :key="index"
    >
      <span>{{ error }}</span>
      <div
        class="btn btn-xs btn-circle btn-ghost"
        @click="() => errors.splice(index, 1)"
      >
        <IconsClose />
      </div>
    </div>
  </div>
</template>
