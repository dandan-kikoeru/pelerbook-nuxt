import axios from 'axios'
import type { User } from '~/types'
export const useFetchPost = () => {
  const auth = useAuthStore()
  const index = useIndexStore()
  const isFetching = ref(false)
  const route: any = useRoute()
  const profile = useProfileStore()
  const single = useSingleStore()

  const fetchIndex = async () => {
    try {
      isFetching.value = true
      const response: any = await axios.get(`/api/post?page=${index.pages}`, {
        headers: {
          Authorization: auth.getBearer,
        },
      })
      index.setPosts(response.data.data)
      index.setLinks(response.data.links)
      // await index.incrementPage()
    } catch (error: any) {
      console.error(`${error.response.status}: ${error.response.data.message}`)
    } finally {
      isFetching.value = false
    }
  }

  const fetchProfile = async () => {
    try {
      isFetching.value = true
      const responsePosts = await axios.get(
        `/api/profile/posts/${route.params.id}?page=${profile.pages}`,
        {
          headers: {
            Authorization: auth.getBearer,
          },
        },
      )
      const responseProfile = await axios.get(
        `/api/profile/${route.params.id}`,
        {
          headers: {
            Authorization: auth.getBearer,
          },
        },
      )
      profile.setLinks(responsePosts.data.links)
      profile.setPosts(responsePosts.data.data)
      // profile.incrementPage()
      profile.setProfileData(responseProfile.data.data)
    } catch (error: any) {
      console.error(error)
      navigateTo('/', { replace: true })
    } finally {
      isFetching.value = false
    }
  }

  const fetchPost = async () => {
    try {
      isFetching.value = true
      const response: any = await axios.get(
        `/api/post/${route.params.postId}`,
        {
          headers: {
            Authorization: auth.getBearer,
          },
        },
      )
      single.post = response.data.data
    } catch (error: any) {
      navigateTo('/', { replace: true })
    } finally {
      isFetching.value = false
    }
  }
  return { isFetching, fetchIndex, fetchProfile, fetchPost }
}
