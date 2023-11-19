<script setup lang="ts">
import type { Post } from '~/types'

definePageMeta({
  middleware: ['auth'],
})
const posts = ref<Post[]>([])
const response: any = await useFetchPosts()

posts.value = response.data.data

const target = ref<HTMLElement | null>(null)
const { stop } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (!isIntersecting) {
    return
  }
  console.log(isIntersecting)
})
</script>
<template>
  <div>
    <Post v-for="post in posts" :post="post" :key="post.id" />
  </div>
  <div ref="target" class="-translate-y-96"/>
</template>
