<script setup lang="ts">
import axios from 'axios'
import type { User } from '~/types'
const { posts, links, pages, profileId } = storeToRefs(useProfileStore())
const { setPosts, incrementPage, setLinks, setProfileId, resetPosts } =
  useProfileStore()
const { user, getBearer } = useAuthStore()
const route: any = useRoute()

definePageMeta({
  middleware: ['auth'],
})
const defaultProfileValue: User = {
  avatar: '/avatars/guest.webp',
  firstname: 'John',
  surname: 'Doe',
  id: 0,
  cover: '',
  createdAt: new Date('1970-01-01T00:00:00.000Z'),
}
const profile = ref<User | null>(defaultProfileValue)

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
    const responsePosts = await axios.get(
      `/api/profile/posts/${route.params.id}?page=${pages.value}`,
      {
        headers: {
          Authorization: getBearer,
        },
      },
    )
    const responseProfile = await axios.get(
      `/api/profile/${route.params.id}?page=${pages.value}`,
      {
        headers: {
          Authorization: getBearer,
        },
      },
    )
    await setLinks(responsePosts.data.links)
    await setPosts(responsePosts.data.data)
    profile.value = responseProfile.data.data
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
  <div class="bg-neutral">
    <div>
      <div
        v-if="profile?.cover"
        class="relative aspect-[3/1] max-w-6xl mx-auto overflow-hidden rounded-b-xl"
      >
        <img class="object-cover w-full h-full" :src="profile?.cover" />
      </div>
      <div
        v-else
        class="relative aspect-[3/1] max-w-6xl mx-auto overflow-hidden rounded-xl bg-black"
      ></div>
    </div>
  </div>
  <div
    class="flex flex-col items-center bg-neutral h-40 border-b border-accent relative"
  >
    <div class="absolute -top-16 flex flex-col items-center">
      <img
        class="h-32 rounded-full border-4 border-neutral"
        :src="profile?.avatar"
      />
      <h1 class="text-2xl">{{ profile?.firstname }} {{ profile?.surname }}</h1>
      Joined
      {{ useDateFormat(profile?.createdAt, 'MMM YYYY').value }}
    </div>
  </div>
  <div
    class="bg-neutral max-w-lg mx-auto mt-4 flex p-4 rounded-xl gap-2"
    v-if="route.params.id == user?.id"
  >
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
  <div v-if="showCreatePost" class="bg-black/50 fixed top-0 w-full h-full z-30">
    <CreatePost
      @close="toggleCreatePost"
      class="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :firstName="user?.firstname"
    />
  </div>
</template>
