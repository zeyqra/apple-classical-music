import { useMutation, useQueryClient } from '@tanstack/react-query'

export const createOptimisticMutation = ({
  getQueryKey,
  mutationFn,
  onMutateUpdateFn,
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

        queryClient.setQueryData(queryKey, oldData => onMutateUpdateFn(oldData, variables))

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
