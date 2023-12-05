import axios from 'axios'
export const useFetchIndex = async () => {
  const { getBearer } = useAuthStore()
  const { pages } = useIndexStore()

  const response: any = await axios
    .get(`/api/post?page=${pages}`, {
      headers: {
        Authorization: getBearer,
      },
    })
    .catch((error) => {
      console.error(`${error.response.status}: ${error.response.data.message}`)
    })

  return { response }
}
