import { getLists, createList, updateList, deleteList, getCurrentList } from '../api/lists'
import { useQuery } from '@tanstack/react-query'
import useListsStore from '../store/useListsStore'
import { createOptimisticMutation } from './helper.js'

export const useLists = () =>
  useQuery({
    queryKey: ['lists'],
    queryFn: () => getLists(),
    staleTime: 1000 * 60 * 5,
  })

export const useCreateList = createOptimisticMutation({
  getQueryKey: () => ['lists'],
  mutationFn: ({ id, ...rest }) => createList(rest),
  updateFn: (oldData, newList) => [...oldData, newList],
  // 乐观更新阶段 设置为临时 id
  onMutateExtra: vars => {
    useListsStore.setState({ currentListId: vars.id })
  },
  // 成功后替换为服务器返回的 id
  onSuccessExtra: (data, variables, context, queryClient) => {
    queryClient.setQueryData(['lists'], (old = []) =>
      old.map(l => (l.id === variables.id ? data : l))
    )
    useListsStore.setState({ currentListId: data.id })
  },
})

export const useUpdateList = createOptimisticMutation({
  getQueryKey: () => ['lists'],
  mutationFn: updateList,
  updateFn: (oldData, updatedList) => oldData.map(l => (l.id === updatedList.id ? updatedList : l)),
})

export const useDeleteList = createOptimisticMutation({
  getQueryKey: () => ['lists'],
  mutationFn: deleteList,
  updateFn: (oldData, deletedListId) => oldData.filter(l => l.id !== deletedListId),
  onMutateExtra: (deletedListId, queryClient) => {
    queryClient.setQueryData(['reminders', deletedListId], [])
    const currentListId = useListsStore.getState().currentListId
    if (currentListId === deletedListId) {
      useListsStore.setState({ currentListId: null })
    }
  },
})

export const useCurrentList = id =>
  useQuery({
    queryKey: ['lists', id],
    queryFn: () => getCurrentList(id),
    enabled: !!id,
  })
