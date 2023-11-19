<script lang="ts" setup>
import type { Post } from '~/types'

defineProps<{ post: Post }>()

</script>
<template>
  <div class="bg-neutral p-4 rounded-2xl my-4 mx-auto md:w-[42rem]">
    <div class="flex gap-1">
      <NuxtLink :to="'/' + post.user.id">
        <label class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img :src="post.user.avatar" />
          </div>
        </label>
      </NuxtLink>
      <div>
        <p class="font-semibold">
          <NuxtLink :to="'/' + post.user.id" class="hover:underline">
            {{ post.user.firstname }}
            {{ post.user.surname }}
          </NuxtLink>
        </p>
        <span class="text-sm">
          <NuxtLink :to="'/posts/' + post.id" class="hover:underline">
            {{ post.createdAt }}
          </NuxtLink>
        </span>
      </div>
    </div>
    <p class="mt-3">
      {{ post.caption }}
    </p>
  </div>
</template>
