import { useEffect, useRef, useState } from 'react'
import { useLists } from '../hooks/useLists'
import useListsStore from '../store/useListsStore.js'
import List from './List.jsx'
import ListInfoForm from './ListInfoForm.jsx'
import { Button } from './ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'

const Lists = () => {
  const { data: lists, isLoading, error } = useLists()
  const currentListId = useListsStore(state => state.currentListId)
  const setCurrentListId = useListsStore(state => state.setCurrentListId)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // 初始化后设置 currentListId
  const hasInitRef = useRef(false)
  useEffect(() => {
    if (!hasInitRef.current && lists?.length > 0) {
      setCurrentListId(lists[0].id)
      hasInitRef.current = true
    }
  }, [lists, setCurrentListId])

  if (error) return <div>Error: {error.message}</div>
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    )
  return (
    <div
      className="lists h-full
     flex flex-col">
      {lists.length ? (
        <div className="w-full flex flex-col">
          {lists.map(list => (
            <List
              key={list.id}
              list={list}
              isActive={list.id === currentListId}
              onClick={() => setCurrentListId(list.id)}
            />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyContent>
            <EmptyHeader>
              <EmptyTitle>No lists</EmptyTitle>
            </EmptyHeader>
            <EmptyDescription>Click the button below to create a new list.</EmptyDescription>
          </EmptyContent>
        </Empty>
      )}

      <ListInfoForm />

      <Button
        className="w-[280px] fixed bottom-0"
        variant="outline"
        onClick={() => setIsDialogOpen(true)}>
        New List
      </Button>
      <ListInfoForm open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}

export default Lists
