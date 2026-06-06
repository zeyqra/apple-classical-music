import request from '../utils/request'

export const getLists = () => {
  return request.get('/lists')
}

export const createList = data => {
  return request.post('/lists', data)
}

export const updateList = data => {
  return request.put(`/lists/${data.id}`, data)
}

export const deleteList = id => {
  return request.delete(`/lists/${id}`)
}

export const getCurrentList = id => {
  return request.get(`/lists/${id}`)
}
