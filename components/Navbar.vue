<script setup lang="ts">
const { user } = storeToRefs(useAuthStore())
const { reset } = useIndexStore()

const { logout } = useAuthStore()

const handleHomeButton = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
  reset()
  navigateTo('/')
}
const [showMenu, toggleMenu] = useToggle(false)
const menuBtn = ref()
</script>
<template>
  <div class="navbar bg-neutral border-b border-accent sticky top-0 z-20">
    <div class="flex-1">
      <NuxtLink
        to="/"
        class="btn btn-ghost text-xl btn-circle"
        @click="handleHomeButton"
      >
        <img src="/logo.webp" />
      </NuxtLink>
    </div>
    <div class="flex-none gap-2 relative">
      <label
        tabindex="0"
        class="btn btn-ghost btn-circle avatar"
        @click="toggleMenu()"
      >
        <div class="w-10 rounded-full" ref="menuBtn">
          <img :src="user?.avatar" />
        </div>
      </label>
      <Menu
        v-if="showMenu"
        class="absolute top-10 right-2 w-80"
        @close="toggleMenu()"
        :menuBtn="menuBtn"
      >
        <li>
          <NuxtLink
            class="py-2 text-lg"
            :to="`${user?.id}`"
            @click="toggleMenu()"
          >
            <IconsProfile />{{ user?.firstname }} {{ user?.surname }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink class="py-2 text-lg" to="/settings" @click="toggleMenu()">
            <IconsSettings />Settings
          </NuxtLink>
        </li>
        <form @submit.prevent="logout">
          <li>
            <button class="py-2 text-lg"><IconsLogout />Log Out</button>
          </li>
        </form>
      </Menu>
    </div>
  </div>
</template>
