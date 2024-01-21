<script setup lang="ts">
const { user } = useAuthStore()
const { resetPosts } = useIndexStore()

const { logout } = useUser()

const handleHomeButton = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
  resetPosts()
  navigateTo('/')
}

const [showMenu, toggleMenu] = useToggle(false)
</script>
<template>
  <div class="navbar bg-neutral border-b border-accent sticky top-0 z-20">
    <div class="flex-1">
      <div class="btn btn-ghost text-xl btn-circle" @click="handleHomeButton">
        <img src="/logo.webp" />
      </div>
    </div>
    <div class="flex-none gap-2 relative">
      <label
        tabindex="0"
        class="btn btn-ghost btn-circle avatar"
        @click="toggleMenu()"
      >
        <div class="w-10 rounded-full">
          <img :src="user?.avatar" />
        </div>
      </label>
      <Menu
        v-if="showMenu"
        class="absolute top-10 right-2 w-80"
        @close="toggleMenu()"
      >
        <li>
          <NuxtLink class="py-2 text-lg" :to="`${user?.id}`">
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
      </Menu>
    </div>
  </div>
</template>
