import axios from 'axios'
export const useDelete = () => {
  const auth = useAuthStore()
  const route: any = useRoute()
  const { posts, resetPosts } = useIndexStore()

  const deletePost = async (id: string, index?: number) => {
    try {
      const res = await axios.post(`/api/post/destroy/${id}`, null, {
        headers: {
          Authorization: auth.getBearer,
        },
      })
      if (index !== undefined) {
        await console.log(index)
        await posts.splice(index, 1)
      }
      if (route.params.id) {
        await window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
        await resetPosts()
        await navigateTo('/')
      }
    } catch (error: any) {
      // console.error(error.response.status)
    }
  }
  return { deletePost }
}
