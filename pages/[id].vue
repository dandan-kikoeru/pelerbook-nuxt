<script setup lang="ts">
import axios from 'axios'
const { posts, links, pages, profileId } = storeToRefs(useProfileStore())
const { setPosts, incrementPage, setLinks, setProfileId, resetPosts } =
  useProfileStore()
const { user, getBearer } = useAuthStore()
const route = useRoute()

definePageMeta({
  middleware: ['auth'],
})

const fetching = ref<boolean>(false)
if (!profileId.value) {
  setProfileId(route.params.id)
}

if (route.params.id !== profileId.value) {
  setProfileId(route.params.id)
  resetPosts()
}

const fetchPost = async () => {
  try {
    const response = await axios.get(
      `/api/profile/${route.params.id}?page=${pages.value}`,
      {
        headers: {
          Authorization: getBearer,
        },
      },
    )
    await setLinks(response.data.links)
    await setPosts(response.data.data)
    await incrementPage()
  } catch (error: any) {
    console.error(error)
    navigateTo('/', { replace: true })
  }
}
const target = ref<HTMLElement | null>(null)
const isObserverActive = ref(true)
useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (!isIntersecting || !isObserverActive.value) {
    return
  }

  if (!links.value?.next) {
    isObserverActive.value = false
  }
  fetchPost()
})

watchArray(posts, () => {
  if (posts.value.length == 0) {
    fetchPost()
    isObserverActive.value = true
  }
})
if (posts.value.length === 0) {
  fetchPost()
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
      :key="post.id"
      :index="index"
    />
    <PostSkeleton v-if="fetching" />
  </div>
  <div ref="target" class="-translate-y-[64rem]" />
  <div v-if="showCreatePost" class="bg-black/50 fixed top-0 w-full h-full">
    <CreatePost
      @close="toggleCreatePost"
      class="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :firstName="user?.firstname"
    />
  </div>
</template>
