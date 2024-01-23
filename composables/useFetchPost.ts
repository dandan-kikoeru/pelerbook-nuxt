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
      await index.setPosts(response.data.data)
      await index.setLinks(response.data.links)
      await index.incrementPage()
    } catch (error: any) {
      console.error(`${error.response.status}: ${error.response.data.message}`)
    } finally {
      isFetching.value = false
    }
  }

  const defaultProfileData: User = reactive({
    avatar: '/avatars/guest.webp',
    firstname: 'John',
    surname: 'Doe',
    id: 0,
    cover: '',
    createdAt: new Date('1970-01-01T00:00:00.000Z'),
  })

  const profileData = ref<User | null>(defaultProfileData)

  const fetchProfile = async () => {
    try {
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
      await profile.setLinks(responsePosts.data.links)
      await profile.setPosts(responsePosts.data.data)
      await profile.incrementPage()
      profileData.value = responseProfile.data.data
    } catch (error: any) {
      console.error(error)
      navigateTo('/', { replace: true })
    }
  }

  const fetchPost = async () => {
    try {
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
    }
  }
  return { isFetching, fetchIndex, fetchProfile, profileData, fetchPost }
}
