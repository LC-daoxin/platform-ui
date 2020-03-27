import request from '@/plugin/axios'

const baseUrl = '/procset/'

export const procSetQuery = query => {
  return request({
    url: `${baseUrl}${query}`,
    method: 'get'
  })
}

export const addProcSet = data => {
  return request({
    url: baseUrl,
    method: 'post',
    data
  })
}

export const updateProcSet = data => {
  return request({
    url: baseUrl,
    method: 'put',
    data
  })
}

export const deleteProcSet = query => {
  return request({
    url: `${baseUrl}${query}`,
    method: 'delete'
  })
}
