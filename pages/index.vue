<script setup lang="ts">
const index = useIndexStore()
const { posts, links } = storeToRefs(index)
const { isLoggedIn } = useAuthStore()
const { isFetching, fetchIndex } = useFetchPost()

useHead({
  title: 'Pelerbook',
})

const fetch = () => {
  fetchIndex()
  index.incrementPage()
}

isLoggedIn
  ? posts.value.length === 0
    ? fetch()
    : ''
  : navigateTo('/login', { replace: true })

const target = ref<HTMLElement | null>(null)
const isObserverActive = ref(true)
useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (!isIntersecting || !isObserverActive.value) {
    return
  }

  !links.value?.next ? (isObserverActive.value = false) : ''
  fetch()
})

watchArray(posts, () => {
  posts.value.length === 0 ? fetch() : ''
})
</script>
<template>
  <PostCreate />
  <div class="mb-4">
    <Post
      v-for="(post, index) in posts"
      :post="post"
      :key="`${post.id}-${index}`"
    />
    <PostSkeleton v-if="isFetching" />
  </div>
  <div ref="target" class="-translate-y-[64rem]" />
</template>
