<script lang="ts" setup>
const { isFetching, fetchPost } = useFetchPost()
const single = useSingleStore()

definePageMeta({
  middleware: ['auth'],
})

useHead({
  title: `${single.post?.user.firstName} ${single.post?.user.surname} - ${truncate(single.post?.caption)} | Pelerbook`,
})

await fetchPost()

useSingleStore().fetchComments()
useSingleStore().incrementPage()
</script>
<template>
  <Post :post="single.post" v-if="single.post" />
  <PostSkeleton v-if="isFetching" />
</template>
