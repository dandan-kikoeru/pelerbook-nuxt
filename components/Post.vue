<script lang="ts" setup>
import type { Post } from '~/types'

const { post, index } = defineProps<{ post: Post; index?: number }>()
const auth = useAuthStore()
const route: any = useRoute()

const [showMenu, toggleMenu] = useToggle(false)
const [showEditPost, toggleEditPost] = useToggle(false)
const { deletePost, likePost, isFetching } = usePost()
const commentPostEl = ref()
const focus = () => {
  commentPostEl.value.textarea.focus()
  commentPostEl.value.peer()
}
const menuBtn = ref()
</script>
<template>
  <div class="card max-w-lg bg-neutral mx-auto mt-4">
    <div class="card-body p-4">
      <div class="flex gap-1">
        <NuxtLink
          :to="`/${post.user.id}`"
          class="btn btn-ghost btn-circle avatar"
        >
          <div class="w-10 rounded-full">
            <img :src="post.user.avatar" />
          </div>
        </NuxtLink>
        <div>
          <p class="font-semibold">
            <NuxtLink :to="`/${post.user.id}`" class="hover:underline">
              {{ post.user.firstname }}
              {{ post.user.surname }}
            </NuxtLink>
          </p>
          <span class="text-sm">
            <NuxtLink :to="`/posts/${post.id}`" class="hover:underline">
              {{ useTimeAgo(post.createdAt).value }}
            </NuxtLink>
          </span>
        </div>
        <div
          class="absolute right-4 btn btn-circle btn-sm text-xl btn-ghost"
          v-if="post.user.id === auth.user?.id"
          @click="toggleMenu()"
          ref="menuBtn"
        >
          <IconsMore />
        </div>
        <Menu
          v-if="showMenu"
          class="absolute right-8 top-12 w-48"
          @close="toggleMenu()"
          :menu-btn="menuBtn"
        >
          <li @click="toggleEditPost()">
            <button class="py-2 text-lg"><IconsEdit />Edit</button>
          </li>
          <form @submit.prevent="deletePost(post.id, index)">
            <li>
              <button class="py-2 text-lg" :disabled="isFetching">
                <IconsDelete />Delete
              </button>
            </li>
          </form>
        </Menu>
      </div>
      <p class="mt-3" v-html="post.caption" />
      <img :src="post.image" v-if="post.image" class="rounded-xl mb-4" />
      <div class="relative h-6">
        <div
          v-if="post.likes"
          class="text-primary flex items-center gap-1 absolute"
        >
          <IconsLiked /> {{ post.likes }}
        </div>
        <div v-if="post.commentsCount" class="absolute right-0 text-sm">
          {{ post.commentsCount }}
          <span>{{ post.commentsCount === 1 ? 'comment' : 'comments' }}</span>
        </div>
      </div>
      <div class="border-accent border-y py-1 flex">
        <form @submit.prevent="likePost(post.id, index)" class="w-full">
          <button
            class="btn btn-ghost btn-block text-base"
            :class="post.likedByUser ? 'text-primary' : ''"
            :disabled="isFetching"
          >
            <template v-if="post.likedByUser">
              <IconsLiked />
              Liked
            </template>
            <template v-else>
              <IconsLike />
              Like
            </template>
          </button>
        </form>
        <div class="w-full">
          <div class="btn btn-ghost btn-block text-base" @click="focus()">
            <IconsComment /> Comment
          </div>
        </div>
      </div>
      <div>
        <div
          v-for="(comment, index) in post.comments"
          v-if="post.commentsCount && route.params.postId"
        >
          <Comment
            :comment="comment"
            class="my-2"
            :key="`${comment.id}-${index}`"
            :id="comment.id"
          />
        </div>
        <div>
          <NuxtLink
            v-if="post.commentsCount > 1 && !route.params.postId"
            :to="`/posts/${post.id}`"
            class="text-sm hover:underline"
            >View more comments</NuxtLink
          >
          <Comment
            :comment="post.comments[post.commentsCount - 1]"
            class="mt-2"
            v-if="post.commentsCount && !route.params.postId"
          />
        </div>
        <CommentPostEl :id="post.id" ref="commentPostEl" :index="index" />
      </div>
    </div>
  </div>
  <div v-if="showEditPost" class="bg-black/50 fixed top-0 w-full h-full z-30">
    <EditPost
      @close="toggleEditPost"
      class="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :firstName="auth.user?.firstname"
      :data="post"
      :index="index"
    />
  </div>
</template>
