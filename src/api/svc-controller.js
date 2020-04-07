import request from '@/plugin/axios'

const baseUrl = '/svc/'

export const svcCate = query => {
  return request({
    url: baseUrl + query,
    method: 'get'
  })
}

export const svcMethod = query => {
  return request({
    url: baseUrl + 'method/' + query,
    method: 'get'
  })
}

export const svcParam = query => {
  return request({
    url: baseUrl + 'param/' + query,
    method: 'get'
  })
}
