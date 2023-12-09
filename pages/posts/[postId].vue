<script lang="ts" setup>
import axios from 'axios'
const route: any = useRoute()
const { getBearer } = useAuthStore()

const posts = ref()
try {
  const res = await axios.get(`/api/post/${route.params.postId}`, {
    headers: {
      Authorization: getBearer,
    },
  })
  posts.value = res.data.data
} catch (error: any) {
  navigateTo('/', { replace: true })
}
</script>
<template>
  <Post :post="posts" v-if="posts" />
</template>
