<script lang="ts" setup>
const { isFetching: isFetchingPost, fetchPost } = useFetchPost()
const single = useSingleStore()

const { post } = storeToRefs(single)
const auth = useAuthStore()

definePageMeta({
  middleware: ['auth'],
  // layout: false,
})

useHead({
  title: `${single.post?.user.firstName} ${single.post?.user.surname} - ${truncate(single.post?.caption)} | Pelerbook`,
})

await fetchPost()
if (!post.value.image) {
  navigateTo('/', { replace: true })
}
single.fetchComments()
single.incrementPage()

const [showMenu, toggleMenu] = useToggle(false)
const [showEditPost, toggleEditPost] = useToggle(false)
const [showSharePost, toggleSharePost] = useToggle(false)
const { deletePost, likePost, isFetching: isPostFetching } = usePost()
const isFetching = computed(() => isFetchingPost.value || isPostFetching.value)
const commentCreateEl = ref()
const focus = () => {
  commentCreateEl.value.textarea.focus()
  commentCreateEl.value.peer()
}

const menuBtn = ref()

const commentsListEl = ref()
const { y } = useWindowScroll()
const handleFetchComments = async () => {
  const before = commentsListEl.value.clientHeight
  await single.fetchComments()
  single.incrementPage()
  const after = commentsListEl.value.clientHeight
  y.value += after - before
}
</script>
<template>
  <div class="flex h-[calc(100vh-4rem-1px)]">
    <div v-if="post.image" class="bg-black grow grid place-items-center w-0">
      <img :src="post.image" />
    </div>
    <NuxtScrollbar>
      <div class="w-96 bg-neutral p-4 min-h-full">
        <div class="flex gap-2 relative">
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
                {{ post.user.firstName }}
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
            class="absolute right-0 btn btn-circle btn-sm text-xl btn-ghost"
            v-if="post.user.id === auth.user?.id"
            @click="toggleMenu()"
            ref="menuBtn"
          >
            <IconsMore />
          </div>
          <Menu
            v-if="showMenu"
            class="absolute right-4 top-8 w-48"
            @close="toggleMenu()"
            :menu-btn="menuBtn"
          >
            <li @click="toggleEditPost()">
              <button class="py-2 text-lg"><IconsEdit />Edit</button>
            </li>
            <form @submit.prevent="deletePost(post.id)">
              <li>
                <button class="py-2 text-lg" :disabled="isFetching">
                  <IconsDelete />Delete
                </button>
              </li>
            </form>
          </Menu>
        </div>
        <div>
          <p class="mt-3 break-words" v-html="formatText(post.caption)" />
          <div
            class="relative h-6 mt-4"
            v-if="post.likes || post.commentsCount || post.sharesCount"
          >
            <div
              v-if="post.likes"
              class="text-primary flex items-center gap-1 absolute"
            >
              <IconsLiked /> {{ post.likes }}
            </div>
            <div class="flex justify-end gap-2">
              <div v-if="post.commentsCount" class="text-sm">
                {{ post.commentsCount }}
                <span>{{
                  post.commentsCount === 1 ? 'comment' : 'comments'
                }}</span>
              </div>
              <div v-if="post.sharesCount" class="text-sm">
                {{ post.sharesCount }}
                <span>{{ post.sharesCount === 1 ? 'share' : 'shares' }}</span>
              </div>
            </div>
          </div>
          <div
            class="border-accent py-1 flex mt-2"
            :class="post.shared ? 'border-b -mt-2' : 'border-y'"
          >
            <form @submit.prevent="likePost(post.id)" class="w-full">
              <button
                class="btn btn-ghost btn-block"
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
              <div class="btn btn-ghost btn-block" @click="focus()">
                <IconsComment /> Comment
              </div>
            </div>
            <div class="w-full">
              <div class="btn btn-ghost btn-block" @click="toggleSharePost()">
                <IconsShare /> Share
              </div>
            </div>
          </div>
          <div ref="commentsListEl">
            <button
              v-if="single.links?.next"
              class="text-sm hover:underline"
              @click="handleFetchComments()"
              :disabled="isFetching"
            >
              View more comments
            </button>
            <div>
              <ul>
                <li
                  v-for="(comment, index) in post.comments"
                  v-if="post.commentsCount"
                >
                  <Comment
                    :comment="comment"
                    :key="`${comment.id}-${index}`"
                    :index="index"
                  />
                </li>
              </ul>
            </div>
            <CommentCreate :post-id="post.id" ref="commentCreateEl" />
          </div>
        </div>
      </div>
    </NuxtScrollbar>
  </div>
  <div v-if="showEditPost" class="bg-black/50 fixed top-0 w-full h-full z-30">
    <PostEditModal
      @close="toggleEditPost()"
      class="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :firstName="auth.user?.firstName"
      :post="post"
    />
  </div>
  <div v-if="showSharePost" class="bg-black/50 fixed top-0 w-full h-full z-30">
    <PostShareModal
      @close="toggleSharePost()"
      class="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      :firstName="auth.user?.firstName"
      :post="post.shared ? post.shared : post"
    />
  </div>
</template>
