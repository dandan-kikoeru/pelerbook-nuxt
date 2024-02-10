<script lang="ts" setup>
const emit = defineEmits()
const createPostEl = ref(null)
const { user } = useAuthStore()
onClickOutside(createPostEl, () => toggleCreatePost())
const { caption } = storeToRefs(useCaptionStore())

const removeNewLine = (input: string | undefined) => {
  if (input !== undefined) {
    return input.replace(/\n/g, ' ')
  }
}
const [showCreatePost, toggleCreatePost] = useToggle(false)
</script>

<template>
  <div class="bg-neutral max-w-lg mx-auto mt-4 flex p-4 rounded-xl gap-2">
    <NuxtLink :to="`${user?.id}`" tabindex="0" class="avatar">
      <div class="rounded-full cursor-pointer w-12">
        <img :src="user?.avatar" />
      </div>
    </NuxtLink>
    <input
      class="bg-accent outline-none py-2 px-4 w-full rounded-full hover:bg-[#4e4f50] cursor-pointer duration-200"
      :placeholder="`What's on your mind, ${user?.firstname}`"
      readonly
      @click="toggleCreatePost()"
      :value="removeNewLine(caption)"
    />
  </div>
  <div v-if="showCreatePost" class="bg-black/50 fixed top-0 w-full h-full z-30">
    <CreatePost :user="user" @close="toggleCreatePost()" ref="createPostEl" />
  </div>
</template>
