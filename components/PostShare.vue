<script lang="ts" setup>
import type { Post } from '~/types'

const { post } = defineProps<{ post: Post }>()
</script>
<template>
  <div class="card max-w-lg bg-neutral mx-auto">
    <div class="card-body p-4">
      <NuxtLink :to="`/posts/${post.id}`">
        <img :src="post.image" v-if="post.image" class="rounded-xl mb-2" />
      </NuxtLink>
      <div class="flex gap-1">
        <NuxtLink
          :to="`/${post.user.id}`"
          class="btn btn-ghost btn-circle avatar"
        >
          <div class="w-10 rounded-full">
            <img :src="post.user.avatar" />
          </div>
        </NuxtLink>
        <div>
          <p class="font-semibold">
            <NuxtLink :to="`/${post.user.id}`" class="hover:underline">
              {{ post.user.firstName }}
              {{ post.user.surname }}
            </NuxtLink>
          </p>
          <span class="text-sm">
            <NuxtLink :to="`/posts/${post.id}`" class="hover:underline">
              {{ useTimeAgo(post.createdAt).value }}
            </NuxtLink>
          </span>
        </div>
      </div>
      <p class="break-words" v-html="formatText(post.caption)" />
    </div>
  </div>
</template>
