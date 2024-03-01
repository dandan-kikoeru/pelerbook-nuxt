<script setup lang="ts">
const profile = useProfileStore()
const { posts, profileData, links } = storeToRefs(profile)
const { isFetching, fetchProfile } = useFetchPost()
const { user } = useAuthStore()
const route = useRoute()

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: 'Pelerbook',
})

if (!profile.profileId) {
  profile.setProfileId(+route.params.id)
}

if (+route.params.id !== profile.profileId) {
  profile.setProfileId(+route.params.id)
  profile.reset()
}

const target = ref<HTMLElement | null>(null)
const isObserverActive = ref(true)

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (!isIntersecting || !isObserverActive.value) {
    return
  }

  if (links.value.next === null) {
    isObserverActive.value = false
  }

  fetchProfile()
  profile.incrementPage()
})
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
      <div class="avatar">
        <div class="rounded-full w-36 border-4 border-neutral">
          <img :src="profileData?.avatar" />
        </div>
      </div>
      <h1 class="text-2xl">
        {{ profileData?.firstName }} {{ profileData?.surname }}
      </h1>
      Joined
      {{ useDateFormat(profileData?.createdAt, 'MMM YYYY').value }}
    </div>
  </div>
  <PostCreate v-if="+route.params.id == user?.id" />
  <div class="mb-4">
    <Post
      v-for="(post, index) in posts"
      :post="post"
      :key="`${post.id}-${index}`"
    />
    <PostSkeleton v-if="isFetching" />
  </div>
  <div ref="target" class="-translate-y-32" />
</template>
