<script lang="ts" setup>
const { isFetching, fetchPost } = useFetchPost()
const single = useSingleStore()
fetchPost()
</script>
<template>
  <Post :post="single.post" v-if="single.post" />
</template>
