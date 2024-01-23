<script lang="ts" setup>
import type { Post } from '~/types'

const { post, index } = defineProps<{ post: Post; index?: number }>()
const auth = useAuthStore()

const [showMenu, toggleMenu] = useToggle(false)
const [showEditPost, toggleEditPost] = useToggle(false)
const handleDeletePost = () => {
  const { deletePost } = usePost()
  deletePost(post.id, index)
}
</script>
<template>
  <div class="card max-w-lg bg-neutral mx-auto mt-4">
    <div class="card-body p-4">
      <div class="flex gap-1">
        <NuxtLink :to="`/${post.user.id}`">
          <label class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img :src="post.user.avatar" />
            </div>
          </label>
        </NuxtLink>
        {{ index }}
        <div>
          <p class="font-semibold">
            <NuxtLink :to="`/${post.user.id}`" class="hover:underline">
              {{ post.user.firstname }}
              {{ post.user.surname }}
            </NuxtLink>
          </p>
          <span class="text-sm">
            <NuxtLink :to="`/posts/${post.id}`" class="hover:underline">
              {{ useTimeAgo(post.createdAt).value }}
            </NuxtLink>
          </span>
        </div>
        <div
          class="absolute right-4 btn btn-circle btn-sm text-xl btn-ghost"
          v-if="post.user.id === auth.user?.id"
          @click="toggleMenu()"
        >
          <IconsMore />
        </div>
        <Menu
          v-if="showMenu"
          class="absolute right-8 top-12 w-48"
          @close="toggleMenu()"
        >
          <li @click="toggleEditPost()">
            <button class="py-2 text-lg"><IconsEdit />Edit</button>
          </li>
          <form @submit.prevent="handleDeletePost()">
            <li>
              <button class="py-2 text-lg"><IconsDelete />Delete</button>
            </li>
          </form>
        </Menu>
      </div>
      <p class="mt-3" v-html="post.caption" />
      <img :src="post.image" v-if="post.image" class="rounded-xl" />
    </div>
  </div>
  <div v-if="showEditPost" class="bg-black/50 fixed top-0 w-full h-full z-30">
    <EditPost
      @close="toggleEditPost"
      class="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :firstName="auth.user?.firstname"
      :data="post"
      :index="index"
    />
  </div>
</template>
