<script lang="ts" setup>
const { isFetching, fetchPost } = useFetchPost()
const single = useSingleStore()
await fetchPost()
const headTitle = (input: string | undefined, maxLength = 63) => {
  if (input !== undefined) {
    const textWithoutTags = input.replace(/<\/?[^>]+(>|$)/g, '')
    const truncatedText = textWithoutTags
      .slice(0, maxLength)
      .replace(/\s+\S*$/, '')
    if (textWithoutTags.length > truncatedText.length) {
      return truncatedText + '...'
    }
    return truncatedText
  }
}

useHead({
  title: `${single.post?.user.firstname} ${single.post?.user.surname} - ${headTitle(single.post?.caption)} | Pelerbook`,
})
</script>
<template>
  <Post :post="single.post" v-if="single.post" />
</template>
