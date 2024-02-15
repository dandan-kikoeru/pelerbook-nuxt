<script lang="ts" setup>
import type { Reply, Comment } from '~/types'
const { reply, index } = defineProps<{
  reply: Reply
  index: number
  comment: Comment
}>()
const replyEl = ref<HTMLElement | null>(null)
const { user } = useAuthStore()
const scroll = () => {
  window.scrollTo({ top: replyEl.value?.offsetTop, behavior: 'smooth' })
}
const [isHover, toggleHover] = useToggle(false)
const [showMenu, toggleMenu] = useToggle(false)
const menuBtn = ref()
const { isFetching, likeReply, deleteReply } = useReply()
const [isEditing, toggleEdit] = useToggle(false)
const replyEditEl = ref()
const handleEditComment = async () => {
  await toggleEdit()
  await replyEditEl.value.textarea.focus()
}
</script>
<template>
  <div>
    <div
      @mouseenter="toggleHover()"
      @mouseleave="toggleHover()"
      ref="replyElEl"
      v-if="!isEditing"
      class="mt-2"
    >
      <div class="flex gap-1">
        <NuxtLink
          :to="`/${reply.user.id}`"
          class="btn btn-ghost btn-circle avatar"
        >
          <div class="w-10 rounded-full">
            <img :src="reply.user.avatar" />
          </div>
        </NuxtLink>
        <div class="flex w-full items-center">
          <div class="items-center">
            <div
              class="bg-[#3a3b3c] py-2 px-4 rounded-3xl w-fit relative max-w-80"
            >
              <p class="font-semibold">
                <NuxtLink :to="`/${reply.user.id}`" class="hover:underline">
                  {{ reply.user.firstname }}
                  {{ reply.user.surname }}
                </NuxtLink>
              </p>
              <p class="break-words" v-html="formatText(reply.content)" />
              <div
                class="absolute bottom-0 rounded-full bg-accent flex gap-1 items-center border-2 border-accent"
                :class="reply.likes > 1 ? 'pr-1 -right-8' : '-right-4'"
                v-if="reply.likes"
              >
                <span class="bg-primary rounded-full p-1 text-xs">
                  <IconsLiked />
                </span>
                <span v-if="reply.likes > 1" class="text-sm">
                  {{ reply.likes }}
                </span>
              </div>
            </div>
          </div>

          <div class="relative">
            <div
              v-if="reply.user.id === user?.id"
              ref="menuBtn"
              class="btn btn-circle btn-sm text-xl btn-ghost opacity-0"
              :class="[
                isHover ? 'opacity-100' : '',
                reply.likes ? 'ml-4' : 'ml-2',
              ]"
              @click="toggleMenu()"
            >
              <IconsMore />
            </div>
            <Menu
              class="absolute w-48 z-10"
              v-if="showMenu"
              @close="toggleMenu()"
              :menu-btn="menuBtn"
            >
              <li>
                <button class="py-2" @click="handleEditComment">Edit</button>
              </li>
              <li>
                <button
                  class="py-2"
                  @click="deleteReply(reply, comment), (isHover = false)"
                  :disabled="isFetching"
                >
                  Delete
                </button>
              </li>
            </Menu>
          </div>
        </div>
      </div>
      <div class="flex ml-16">
        <span
          class="text-sm hover:underline cursor-pointer w-fit"
          @click="scroll"
        >
          {{ formatDate(useTimeAgo(reply.createdAt).value) }}
        </span>
        <span
          class="text-sm ml-4 hover:underline cursor-pointer font-semibold"
          :class="reply.likedByUser ? 'text-primary' : ''"
          @click="likeReply(reply.id, comment)"
        >
          <template v-if="reply.likedByUser"> Liked </template>
          <template v-else> Like </template>
        </span>
        <span class="text-sm ml-4 hover:underline cursor-pointer font-semibold" @click="$emit('reply')"
          >Reply</span
        >
      </div>
    </div>
    <ReplyEdit
      :comment="comment"
      :reply="reply"
      v-if="isEditing"
      ref="replyEditEl"
      :index="index"
      @close="toggleEdit(), toggleMenu(), (isHover = false)"
    />
  </div>
</template>
