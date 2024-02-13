<script lang="ts" setup>
const { isFetching, fetchPost } = useFetchPost()
const single = useSingleStore()
await fetchPost()

useHead({
  title: `${single.post?.user.firstname} ${single.post?.user.surname} - ${truncate(single.post?.caption)} | Pelerbook`,
})
</script>
<template>
  <Post :post="single.post" v-if="single.post" />
  <PostSkeleton v-if="isFetching" />
</template>
