import axios from 'axios'
export const useFetchPosts = async () => {
  const { getBearer } = useAuthStore()
  const response = await axios
    .get('/api/post', {
      headers: {
        Authorization: getBearer,
      },
    })
    .catch((error) => {
      console.error(`${error.response.status}: ${error.response.data.message}`)
    })
  return response
}
