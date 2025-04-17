let apiRoot = ''

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8001'
}

if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://dung-be-w74s.onrender.com'
}

export const API_ROOT = apiRoot
