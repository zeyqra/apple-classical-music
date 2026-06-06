import request from '../utils/request'

export const getReminders = listId => {
  return request.get(`/reminders?listId=${listId}`)
}

export const createReminder = data => {
  return request.post('/reminders', data)
}

export const updateReminder = data => {
  return request.put(`/reminders/${data.id}`, data)
}

export const deleteReminder = data => {
  return request.delete(`/reminders/${data.id}`)
}

export const deleteReminders = data => {
  return request.post(`/reminders/delete`, data)
}

export const completeReminders = data => {
  return request.post('/reminders/complete', data)
}

export const moveReminders = data => {
  return request.post('/reminders/move', data)
}
