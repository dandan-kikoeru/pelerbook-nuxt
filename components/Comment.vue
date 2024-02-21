<script lang="ts" setup>
import type { Comment } from '~/types'
const { comment, index } = defineProps<{
  comment: Comment
  index: number
}>()
const commentEl = ref()
const { user } = useAuthStore()
const scroll = () => {
  window.scrollTo({ top: commentEl.value?.offsetTop, behavior: 'smooth' })
}
const [isHover, toggleHover] = useToggle(false)
const [showMenu, toggleMenu] = useToggle(false)
const menuBtn = ref()
const { isFetching, likeComment, deleteComment } = useComment()
const [isEditing, toggleEdit] = useToggle(false)
const commentEditEl = ref()
const handleEditComment = async () => {
  await toggleEdit()
  await commentEditEl.value.textarea.focus()
}

const replyCreateEl = ref()
const isReplying = ref(false)
const toggleReply = (val: boolean) => {
  isReplying.value = val
}
const handleCreateReply = async () => {
  await toggleReply(true)
  replyCreateEl.value.textarea.focus()
  replyCreateEl.value.peer()
}
</script>
<template>
  <div>
    <div
      @mouseenter="toggleHover()"
      @mouseleave="toggleHover()"
      ref="commentEl"
      class="mt-2"
      v-if="!isEditing"
    >
      <div class="flex gap-1">
        <NuxtLink
          :to="`/${comment.user.id}`"
          class="btn btn-ghost btn-circle avatar"
        >
          <div class="w-10 rounded-full">
            <img :src="comment.user.avatar" />
          </div>
        </NuxtLink>
        <div class="flex items-center">
          <div class="items-center">
            <div class="bg-[#3a3b3c] py-2 px-4 rounded-3xl relative max-w-96">
              <p class="font-semibold">
                <NuxtLink :to="`/${comment.user.id}`" class="hover:underline">
                  {{ comment.user.firstname }}
                  {{ comment.user.surname }}
                </NuxtLink>
              </p>
              <p class="break-words" v-html="formatText(comment.content)" />
              <div
                class="absolute bottom-0 rounded-full bg-accent flex gap-1 items-center border-2 border-accent"
                :class="comment.likes > 1 ? 'pr-1 -right-8' : '-right-4'"
                v-if="comment.likes"
              >
                <span class="bg-primary rounded-full p-1 text-xs">
                  <IconsLiked />
                </span>
                <span v-if="comment.likes > 1" class="text-sm">
                  {{ comment.likes }}
                </span>
              </div>
            </div>
          </div>
          <div class="relative">
            <div
              v-if="comment.user.id === user?.id"
              ref="menuBtn"
              class="btn btn-circle btn-sm text-xl btn-ghost opacity-0"
              :class="[
                isHover ? 'opacity-100' : '',
                comment.likes ? 'ml-4' : 'ml-2',
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
                  @click="deleteComment(comment), (isHover = false)"
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
          @click="scroll()"
        >
          {{ formatDate(useTimeAgo(comment.createdAt).value) }}
        </span>
        <span
          class="text-sm ml-4 hover:underline cursor-pointer font-semibold"
          :class="comment.likedByUser ? 'text-primary' : ''"
          @click="likeComment(comment.id, comment.postId, index)"
        >
          <template v-if="comment.likedByUser"> Liked </template>
          <template v-else> Like </template>
        </span>
        <span
          class="text-sm ml-4 hover:underline cursor-pointer font-semibold"
          @click="handleCreateReply()"
          >Reply</span
        >
      </div>
    </div>
    <CommentEdit
      :comment="comment"
      v-if="isEditing"
      ref="commentEditEl"
      :index="index"
      @close="toggleEdit(), toggleMenu(), (isHover = false)"
    />
    <ul>
      <li v-for="(reply, index) in comment.replies">
        <Reply
          class="ml-16"
          :reply="reply"
          :comment="comment"
          :key="`${reply.id}-${index}`"
          :index="index"
          @reply="handleCreateReply()"
        />
      </li>
      <ReplyCreate
        :comment="comment"
        class="ml-16"
        ref="replyCreateEl"
        v-if="isReplying"
      />
    </ul>
  </div>
</template>
