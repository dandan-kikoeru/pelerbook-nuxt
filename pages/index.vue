<script setup lang="ts">
const { posts, links, pages } = storeToRefs(useIndexStore())
const index = useIndexStore()
const { user, isLoggedIn } = useAuthStore()
const { isFetching, fetchIndex } = useFetchPost()

// definePageMeta({
//   middleware: 'auth',
// })

if (!isLoggedIn) {
  navigateTo('/login', { replace: true })
}

useHead({
  title: 'Pelerbook',
})

const target = ref<HTMLElement | null>(null)
const isObserverActive = ref(true)
useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (!isIntersecting || !isObserverActive.value) {
    return
  }

  if (!links.value?.next) {
    isObserverActive.value = false
  }
  fetchIndex()
  index.incrementPage()
})

if (posts.value.length === 0) {
  fetchIndex()
  index.incrementPage()
}
</script>
<template>
  <CreatePostEl />
  <div class="mb-4">
    <Post
      v-for="(post, index) in posts"
      :post="post"
      :key="`${post.id}-${index}`"
      :index="index"
    />
    <PostSkeleton v-if="isFetching" />
  </div>
  <div ref="target" class="-translate-y-[64rem]" />
</template>
