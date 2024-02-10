<script lang="ts" setup>
import type { Comment } from '~/types'
defineProps<{ comment: Comment }>()
const commentEl = ref<HTMLElement | null>(null)
const scroll = () => {
  window.scrollTo({ top: commentEl.value?.offsetTop, behavior: 'smooth' })
}
const [isHover, toggleHover] = useToggle(false)
const [showMenu, toggleMenu] = useToggle(false)
const menuBtn = ref()
</script>
<template>
  <div @mouseenter="toggleHover()" @mouseleave="toggleHover()" ref="commentEl">
    <div class="flex gap-1">
      <NuxtLink
        :to="`/${comment.user.id}`"
        class="btn btn-ghost btn-circle avatar"
      >
        <div class="w-10 rounded-full">
          <img :src="comment.user.avatar" />
        </div>
      </NuxtLink>
      <div class="flex w-full items-center">
        <div class="items-center">
          <div class="bg-[#3a3b3c] py-2 px-4 rounded-3xl w-fit break-all">
            <p class="font-semibold">
              <NuxtLink :to="`/${comment.user.id}`" class="hover:underline">
                {{ comment.user.firstname }}
                {{ comment.user.surname }}
              </NuxtLink>
            </p>
            <p v-html="comment.content" />
          </div>
        </div>
        <div class="relative">
          <div
            ref="menuBtn"
            class="btn btn-circle btn-sm text-xl btn-ghost opacity-0 ml-2"
            :class="isHover ? 'opacity-100' : ''"
            @click="toggleMenu()"
          >
            <IconsMore />
          </div>
          <Menu
            class="absolute w-48 z-10"
            v-if="showMenu"
            @close="toggleMenu()"
            :menu-btn="menuBtn"
          >
            <li>
              <button class="py-2">Edit</button>
            </li>
            <li>
              <button class="py-2">Delete</button>
            </li>
          </Menu>
        </div>
      </div>
    </div>
    <div class="flex ml-16">
      <span
        class="text-sm hover:underline cursor-pointer w-fit"
        @click="scroll"
      >
        {{ formatDate(useTimeAgo(comment.createdAt).value) }}
      </span>
      <span class="text-sm ml-4 hover:underline cursor-pointer font-semibold"
        >Like</span
      >
      <span class="text-sm ml-4 hover:underline cursor-pointer font-semibold"
        >Reply</span
      >
    </div>
  </div>
</template>
