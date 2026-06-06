import { useMutation, useQueryClient } from '@tanstack/react-query'

export const createOptimisticMutation = ({
  getQueryKey,
  mutationFn,
  updateFn, // onMutate: queryClient.setQueryData
  onMutateExtra,
  onSuccessExtra,
  invalidate = false,
}) => {
  return () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn,
      onMutate: async variables => {
        const queryKey = getQueryKey(variables)

        await queryClient.cancelQueries(queryKey)

        const previousData = queryClient.getQueryData(queryKey)

        queryClient.setQueryData(queryKey, oldData => updateFn(oldData, variables))

        // 额外逻辑（比如删除 reminders / zustand）
        onMutateExtra?.(variables, queryClient)

        return { previousData, queryKey }
      },
      onError: (err, variables, context) => {
        queryClient.setQueryData(context.queryKey, context.previousData)
      },
      onSuccess: (data, variables, context) => {
        if (invalidate) queryClient.invalidateQueries({ queryKey: context.queryKey })
        onSuccessExtra?.(data, variables, context, queryClient)
      },
      // onSettled: (data, err, variables, context) => {},
    })
  }
}
