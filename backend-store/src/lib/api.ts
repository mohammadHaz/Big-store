import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

let isRefreshing = false
let queue: {
  resolve: () => void
  reject: (error: unknown) => void
}[] = []

function processQueue(error?: unknown) {
  queue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve()
    }
  })

  queue = []
}

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        queue.push({ resolve, reject })
      }).then(() => api(originalRequest))
    }

    isRefreshing = true

    try {
      // السيرفر يقرأ Refresh Token من الـ Cookie
      // ويعيد تعيين Access Token داخل Cookie جديدة
      await api.post('/auth/refresh')

      processQueue()

      return api(originalRequest)
    } catch (err) {
      processQueue(err)

      // يمكن هنا تحويل المستخدم إلى صفحة تسجيل الدخول
      // window.location.href = '/login'

      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)