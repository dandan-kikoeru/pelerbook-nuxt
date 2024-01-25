<script setup lang="ts">
const profile = useProfileStore()
const { posts } = storeToRefs(useProfileStore())

const { isFetching, fetchProfile, profileData } = useFetchPost()
const { user } = useAuthStore()
const route: any = useRoute()

definePageMeta({
  middleware: ['auth'],
})

if (!profile.profileId) {
  profile.setProfileId(route.params.id)
}

if (route.params.id !== profile.profileId) {
  profile.setProfileId(route.params.id)
  profile.resetPosts()
}

const target = ref<HTMLElement | null>(null)
const isObserverActive = ref(true)
useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (!isIntersecting || !isObserverActive.value) {
    return
  }

  if (!profile.links?.next) {
    isObserverActive.value = false
  }
  fetchProfile()
})

watchArray(posts, () => {
  if (posts.value.length == 0) {
    fetchProfile()
    isObserverActive.value = true
  }
})

if (posts.value.length === 0) {
  fetchProfile()
}

const [showCreatePost, toggleCreatePost] = useToggle(false)
const captionStore = useCaptionStore()
</script>
<template>
  <div class="bg-neutral">
    <div>
      <div
        v-if="profileData?.cover"
        class="relative aspect-[3/1] max-w-6xl mx-auto overflow-hidden rounded-b-xl"
      >
        <img class="object-cover w-full h-full" :src="profileData?.cover" />
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
        :src="profileData?.avatar"
      />
      <h1 class="text-2xl">
        {{ profileData?.firstname }} {{ profileData?.surname }}
      </h1>
      Joined
      {{ useDateFormat(profileData?.createdAt, 'MMM YYYY').value }}
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
