export const deepCopy = (obj) => {
  if (typeof obj !== 'object') return {}
  return JSON.parse(JSON.stringify(obj))
}

export const builder = (data, code = 0, isSuccess = true, message = '', headers = {}) => {
  const responseBody = {}
  if (!data) return responseBody
  responseBody.data = { ...data }
  responseBody.error_code = 0
  responseBody.data.isSuccess = true
  responseBody.data.msg = ''
  if (code !== undefined && code !== 0) {
    responseBody.error_code = code
  }
  if (!isSuccess) {
    responseBody.data.isSuccess = false
    responseBody.data.msg = message
  }
  if (headers !== null && typeof headers === 'object' && Object.keys(headers).length > 0) {
    responseBody._headers = headers
  }
  return responseBody
}

export const getQueryParameters = (options) => {
  const { url } = options
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') +
      '"}'
  )
}

export const getBody = (options) => {
  return options.body && JSON.parse(options.body)
}

export const functionFactory = (func) => (options) => {
  const queryParams = getQueryParameters(options)
  console.log('query Params: ', queryParams)
  if (Object.keys(queryParams).length) return deepCopy(func(queryParams))
  const body = getBody(options)
  console.log('data: ', body.data)
  return deepCopy(func(body.data))
}
