import axios from 'axios'
export const useDelete = () => {
  const auth = useAuthStore()
  const route: any = useRoute()
  const { posts, resetPosts: resetIndexPosts } = useIndexStore()
  const { resetPosts: resetProfilePosts } = useProfileStore()

  const deletePost = async (id: string, index?: number) => {
    try {
      const res = await axios.post(`/api/post/destroy/${id}`, null, {
        headers: {
          Authorization: auth.getBearer,
        },
      })
      if (index !== undefined) {
        await posts.splice(index, 1)
      }
      if (route.params.postId) {
        await window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
        await resetIndexPosts()
        await navigateTo('/')
      }
      if (route.params.id) {
        await window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
        await resetProfilePosts()
      }
    } catch (error: any) {
      // console.error(error.response.status)
    }
  }
  return { deletePost }
}
