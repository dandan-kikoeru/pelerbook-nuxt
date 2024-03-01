<script setup lang="ts">
import type { AxiosError } from '~/types'

definePageMeta({
  layout: false,
  middleware: ['guest'],
})

useHead({
  title: 'Pelerbook - log in or sign up',
})

const showRegister = ref<boolean>(false)
const toggleRegister = () => {
  errors.value = []
  showRegister.value = !showRegister.value
}
const registerModalEl = ref<null | HTMLElement>(null)

const form = reactive({
  email: '',
  password: '',
})

const auth = useAuthStore()
const { isFetching } = storeToRefs(auth)

const { errors } = storeToRefs(useGeneralStore())
const submit = async () => {
  try {
    await auth.login(form)
    errors.value = []
  } catch (e: unknown) {
    const { response } = e as AxiosError
    if (response.data.errors) {
      const { email = [], password = [] } = response.data.errors
      errors.value = []
      errors.value.push(...email, ...password)
    } else {
      errors.value = []
      errors.value.push(response.data.message)
    }
  }
}
</script>
<template>
  <div class="flex justify-center items-center min-h-screen flex-col">
    <div class="text-center mb-16">
      <img src="/title.webp" class="max-w-xs" />
      <p class="max-w-xs mt-8 text-lg">
        Pelerbook helps you connect your peler and share it with other people's
        peler.
      </p>
    </div>
    <form @submit.prevent="submit">
      <div class="card w-96 bg-neutral shadow-xl">
        <div class="card-body gap-4">
          <input
            type="text"
            placeholder="Email address"
            class="input w-full bg-base-100 max-w-xs"
            v-model="form.email"
          />
          <input
            type="password"
            placeholder="Password"
            class="input bg-base-100 w-full max-w-xs"
            v-model="form.password"
          />
          <div
            class="card-actions justify-center border-b-2 border-accent pb-4 flex-col items-center"
          >
            <button
              class="btn btn-primary normal-case w-full mt-2"
              :disabled="isFetching"
            >
              Log in
            </button>
            <NuxtLink to="/recover" class="hover:underline text-primary text-sm"
              >Forgotten password?</NuxtLink
            >
          </div>
          <div
            @click="toggleRegister()"
            class="btn btn-secondary normal-case w-2/3 mx-auto mt-2"
          >
            Create new account
          </div>
        </div>
      </div>
    </form>
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
  </div>
  <div
    v-if="showRegister"
    class="bg-black/50 fixed top-0 w-full h-full"
    @click="(e) => (e.target === registerModalEl ? toggleRegister() : 0)"
    ref="registerModalEl"
  >
    <Register
      @close="toggleRegister()"
      class="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    />
  </div>
</template>
