import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  completeReminders,
  createReminder,
  deleteReminder,
  deleteReminders,
  getReminders,
  moveReminders,
  updateReminder,
} from '../api/reminders.js'
import { createOptimisticMutation } from './helper.js'
import { getNextOrder } from '../utils/helper.js'

export const useReminders = listId => {
  return useQuery({
    queryKey: ['reminders', listId],
    queryFn: () => getReminders(listId),
    enabled: !!listId,
    staleTime: 60 * 1000,
  })
}

export const usePrefetchReminders = () => {
  const queryClient = useQueryClient()
  return listId => {
    queryClient.prefetchQuery({
      queryKey: ['reminders', listId],
      queryFn: () => getReminders(listId),
      staleTime: 60 * 1000,
    })
  }
}

export const useCreateEmptyCacheReminder = () => {
  const queryClient = useQueryClient()
  return (listId, order) => {
    queryClient.setQueryData(['reminders', listId], (old = []) => {
      return [
        ...old,
        {
          id: 'temp-new' + Math.random().toString(36).substr(2, 9),
          listId,
          title: '',
          completed: false,
          order,
        },
      ]
    })
  }
}
export const useRemoveEmptyCacheReminder = () => {
  const queryClient = useQueryClient()
  return (listId, reminder) => {
    queryClient.setQueryData(['reminders', listId], (old = []) =>
      old.filter(r => r.id !== reminder.id)
    )
  }
}

export const useCreateReminder = createOptimisticMutation({
  getQueryKey: newReminder => ['reminders', newReminder.listId],
  mutationFn: ({ id, ...rest }) => createReminder(rest),
  updateFn: (old, updatedReminder) =>
    old.map(r => (r.id === updatedReminder.id ? updatedReminder : r)),
})

export const useUpdateReminder = createOptimisticMutation({
  getQueryKey: updatedReminder => ['reminders', updatedReminder.listId],
  mutationFn: updateReminder,
  updateFn: (old, updatedReminder) =>
    old.map(r => (r.id === updatedReminder.id ? updatedReminder : r)),
})

export const useDeleteReminder = createOptimisticMutation({
  getQueryKey: deletedReminder => ['reminders', deletedReminder.listId],
  mutationFn: deleteReminder,
  updateFn: (old, deletedReminder) => old.filter(r => r.id !== deletedReminder.id),
})

export const useDeleteReminders = createOptimisticMutation({
  getQueryKey: deleteReminders => ['reminders', deleteReminders.currentListId],
  mutationFn: deleteReminders,
  updateFn: (old, deleteReminders) => old.filter(r => !deleteReminders.reminderIds.includes(r.id)),
})

export const useCompleteReminders = createOptimisticMutation({
  getQueryKey: vars => ['reminders', vars.currentListId],
  mutationFn: completeReminders,
  updateFn: (old, vars) =>
    old.map(r => (vars.reminderIds.includes(r.id) ? { ...r, completed: true } : r)),
})

export const useMoveReminders = createOptimisticMutation({
  getQueryKey: vars => ['reminders', vars.currentListId],
  mutationFn: vars => moveReminders({ updates: vars.updates }),
  updateFn: () => {},
  onMutateExtra: (vars, queryClient) => {
    const { reminderIds, currentListId, targetListId } = vars
    const currentQueryKey = ['reminders', currentListId]
    const targetQueryKey = ['reminders', targetListId]
    const currentReminders = queryClient.getQueryData(currentQueryKey) || []
    const targetReminders = queryClient.getQueryData(targetQueryKey) || []

    const moved = currentReminders.filter(r => reminderIds.includes(r.id))

    // 当前 list 中移除
    queryClient.setQueryData(currentQueryKey, old =>
      (old || []).filter(r => !reminderIds.includes(r.id))
    )

    // 目标 list 中添加（计算 order）
    const nextOrder = getNextOrder(targetReminders)
    const movedWithOrder = moved.map((r, i) => ({
      ...r,
      listId: targetListId,
      order: nextOrder + i * 100,
    }))
    queryClient.setQueryData(targetQueryKey, old => [...(old || []), ...movedWithOrder])

    vars.updates = movedWithOrder.map(({ id, listId, order }) => ({ id, listId, order }))

    return [
      { queryKey: currentQueryKey, previousData: currentReminders },
      { queryKey: targetQueryKey, previousData: targetReminders },
    ]
  },
})
