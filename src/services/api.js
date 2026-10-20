import axios from 'axios'

const API = 'https://lldev.thespacedevs.com/2.3.0'

export async function getSpaceXData(endpoint) {
  const key = `spacex_${endpoint}`
  const cached = localStorage.getItem(key)

  if (cached) {
    const { data, timestamp } = JSON.parse(cached)

    // Cache valable pendant 1 heure
    if (Date.now() - timestamp < 3600000) {
      return data
    }
  }

  const response = await axios.get(`${API}${endpoint}`)

  localStorage.setItem(
    key,
    JSON.stringify({
      data: response.data,
      timestamp: Date.now()
    })
  )

  return response.data
}