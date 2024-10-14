import axios from 'axios'
import { getHeaders, getRequestURL } from 'vinxi/http'

export const axiosServer = () => {
  const url = new URL(getRequestURL())
  const baseUrl = `${url.protocol}//${url.host}`

  const axiosServer = axios.create({
    baseURL: `${baseUrl}`, // Set your API base URL
    headers: getHeaders(),
  })

  return axiosServer
}

export const formatDate = (dateString: string) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}
