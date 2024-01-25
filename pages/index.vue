<script setup lang="ts">
const { posts, links } = storeToRefs(useIndexStore())
const { user } = useAuthStore()
const { isFetching, fetchIndex } = useFetchPost()

definePageMeta({
  middleware: ['auth'],
})

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
})

watchArray(posts, () => {
  if (posts.value.length == 0) {
    fetchIndex()
    isObserverActive.value = true
  }
})
if (posts.value.length === 0) {
  fetchIndex()
}

const [showCreatePost, toggleCreatePost] = useToggle(false)
const captionStore = useCaptionStore()
</script>
<template>
  <div class="bg-neutral max-w-lg mx-auto mt-4 flex p-4 rounded-xl gap-2">
    <NuxtLink :to="`${user?.id}`" class="h-12 aspect-square">
      <img :src="user?.avatar" class="rounded-full" />
    </NuxtLink>
    <input
      class="bg-accent outline-none py-2 px-4 w-full rounded-full hover:bg-[#4e4f50] cursor-pointer duration-200"
      :placeholder="`What's on your mind, ${user?.firstname}`"
      readonly
      @click="toggleCreatePost()"
      :value="captionStore.caption"
    />
  </div>
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
  <div v-if="showCreatePost" class="bg-black/50 fixed top-0 w-full h-full z-30">
    <CreatePost
      @close="toggleCreatePost"
      class="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :firstName="user?.firstname"
    />
  </div>
</template>
