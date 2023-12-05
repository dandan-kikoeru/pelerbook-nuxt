<script setup lang="ts">
const emit = defineEmits()
const register = ref(null)

onClickOutside(register, () => emit('close'))

useEventListener(document, 'keydown', (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
})
const form = reactive({
  firstname: '',
  surname: '',
  email: '',
  password: '',
})
const fetching = ref<boolean>(false)
const submit = async () => {
  fetching.value = true
  const { isFetching } = await useRegister(form)
  fetching.value = isFetching.value
}
</script>
<template>
  <div class="card w-[28rem] bg-neutral shadow-xl" ref="register">
    <form @submit.prevent="submit">
      <div class="border-b py-6 border-accent flex justify-between">
        <div class="px-6">
          <p class="font-bold text-2xl">Sign up</p>
          <p>It's quick and easy.</p>
        </div>
        <div
          @click="$emit('close')"
          class="btn btn-circle btn-accent btn-sm mr-4 cursor-pointer float-right h-fit"
        >
          <IconsClose />
        </div>
      </div>
      <div class="card-body gap-4 py-4">
        <div class="flex gap-4">
          <div class="flex flex-col gap-4">
            <input
              name="firstname"
              type="text"
              placeholder="First name"
              class="input w-full max-w-xs bg-base-100"
              v-model="form.firstname"
            />
          </div>
          <div class="flex flex-col gap-4">
            <input
              name="surname"
              type="text"
              placeholder="Surname"
              class="input w-full max-w-xs bg-base-100"
              v-model="form.surname"
            />
          </div>
        </div>

        <input
          name="email"
          type="text"
          placeholder="Email address"
          class="input w-full bg-base-100"
          v-model="form.email"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          class="input w-full bg-base-100"
          v-model="form.password"
        />
        <p class="text-xs">
          People who use our service may have uploaded your contact information
          to Pelerbook.
          <NuxtLink to="/help" class="text-primary hover:underline"
            >Learn more.</NuxtLink
          >
        </p>
        <p class="text-xs">
          By clicking Sign Up, you agree to our
          <NuxtLink to="/about/terms" class="text-primary hover:underline"
            >Terms</NuxtLink
          >,
          <NuxtLink to="/about/privacy" class="text-primary hover:underline"
            >Privacy Policy</NuxtLink
          >
          and
          <NuxtLink to="/about/cookies" class="text-primary hover:underline"
            >Cookies Policy</NuxtLink
          >. You may receive SMS notifications from us and can opt out at any
          time.
        </p>
        <button
          class="btn btn-secondary normal-case w-2/3 mx-auto mt-2"
          :disabled="fetching"
        >
          Sign up
        </button>
      </div>
    </form>
  </div>
</template>
