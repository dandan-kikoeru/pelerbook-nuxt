<script setup lang="ts">
import axios from 'axios'
const auth = useAuthStore()
definePageMeta({
  middleware: ['auth'],
})
useHead({
  title: 'Pelerbook',
})

const form: any = reactive({
  avatar: '',
  cover: '',
})
const isFetching = ref(false)
const submit = async () => {
  try {
    isFetching.value = true
    const response = await axios.post('/api/user/update', form, {
      headers: {
        Authorization: auth.getBearer,
        'Content-Type': 'multipart/form-data',
      },
    })
    await auth.setUser(response.data)
  } catch (error) {
  } finally {
    isFetching.value = false
    handleCancelPreview()
  }
}

const handleCancelPreview = () => {
  form.avatar = ''
  form.cover = ''
  avatarPreviewUrl.value = auth.user?.avatar
  coverPreviewUrl.value = auth.user?.cover
  resetEdit()
  isEditing.value = false
}
/**
 *  * AVATAR
 */

const avatarInputEl = ref<any>(null)
const avatarPreviewUrl = ref<any>(auth.user?.avatar)
const openAvatar = () => {
  avatarInputEl.value.click()
}
const handleAvatarInput = () => {
  handleCancelPreview()
  if (
    !['image/png', 'image/jpeg', 'image/webp'].includes(
      avatarInputEl.value?.files[0].type,
    )
  ) {
    return console.error('File format not supported')
  }
  form.avatar = avatarInputEl.value?.files[0]
  avatarPreviewUrl.value = URL.createObjectURL(form.avatar)
}

/**
 *  * COVER
 */

const coverInputEl = ref<any>(null)
const coverPreviewUrl = ref<any>(auth.user?.cover)
const openCover = () => {
  coverInputEl.value.click()
}
const handleCoverInput = () => {
  handleCancelPreview()
  if (
    !['image/png', 'image/jpeg', 'image/webp'].includes(
      coverInputEl.value?.files[0].type,
    )
  ) {
    return console.error('File format not supported')
  }
  form.cover = coverInputEl.value?.files[0]
  coverPreviewUrl.value = URL.createObjectURL(form.cover)
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
  formName.firstname = auth.user?.firstname
  formName.surname = auth.user?.surname
}
const submitName = async () => {
  try {
    isFetching.value = true
    const response = await axios.post('/api/user/update', formName, {
      headers: {
        Authorization: auth.getBearer,
        'Content-Type': 'multipart/form-data',
      },
    })
    auth.setUser(response.data)
    toggleEdit()
  } catch (error) {
  } finally {
    isFetching.value = false
  }
}
const formName = reactive({
  firstname: auth.user?.firstname,
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
              name="firstname"
              type="text"
              placeholder="First name"
              class="input w-full max-w-xs bg-base-100"
              v-model="formName.firstname"
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
</template>
