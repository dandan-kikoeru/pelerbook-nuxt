<script setup lang="ts">
const logout = () => useLogout()
const { user } = useAuthStore()
</script>
<template>
  <div class="navbar bg-neutral border-b border-accent sticky top-0 z-20">
    <div class="flex-1">
      <NuxtLink class="btn btn-ghost text-xl btn-circle" to="/">
        <img src="/logo.webp" />
      </NuxtLink>
    </div>
    <div class="flex-none gap-2">
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img :src="user?.avatar" />
          </div>
        </label>
        <ul
          tabindex="0"
          class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-neutral rounded-box w-80"
        >
          <li>
            <NuxtLink class="py-2 text-lg" :to="'/' + user?.id">
              <IconsProfile />{{ user?.firstname }} {{ user?.surname }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink class="py-2 text-lg" to="/settings">
              <IconsSettings />Settings
            </NuxtLink>
          </li>
          <form @submit.prevent="logout">
            <li>
              <button class="py-2 text-lg"><IconsLogout />Log Out</button>
            </li>
          </form>
        </ul>
      </div>
    </div>
  </div>
</template>
