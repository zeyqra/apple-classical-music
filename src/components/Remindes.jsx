import { useEffect, useRef, useState } from 'react'
import {
  useReminders,
  useCreateEmptyCacheReminder,
  useDeleteReminders,
  useMoveReminders,
  useUpdateReminder,
  useCreateReminder,
  useCompleteReminders,
} from '../hooks/useReminders.js'
import useAppStore from '../store/useAppStore.js'
import useListsStore from '../store/useListsStore.js'
import Reminder from './Reminder.jsx'
import { useLists, useDeleteList, useUpdateList } from '../hooks/useLists.js'
import { ArrowDownUp, Eye, EyeClosed, EyeOff, Info, MoreHorizontalIcon, Plus } from 'lucide-react'
import ListInfoForm from './ListInfoForm.jsx'
import { colorMap } from '../utils/maps.js'
import { getNextOrder } from '../utils/helper.js'
import { useConfirm } from '@/hooks/useConfirm.jsx'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertTriangleIcon,
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  ShareIcon,
  TrashIcon,
  UserRoundXIcon,
  VolumeOffIcon,
} from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import MoveDialog from './MoveDialog.jsx'
import { Spinner } from './ui/spinner.jsx'

const Reminders = () => {
  const currentListId = useListsStore(state => state.currentListId)
  const { data: lists } = useLists()
  const { data: reminders = [], isLoading, error } = useReminders(currentListId)
  const currentList = lists?.find(list => list.id === currentListId)

  const filter = useAppStore(state => state.filter)
  const setFilter = useAppStore(state => state.setFilter)

  // 点击plus创建
  const crateEmptyCacheReminder = useCreateEmptyCacheReminder()
  const handlePlusClick = () => {
    crateEmptyCacheReminder(currentListId, getNextOrder(reminders))
  }
  // 点击空白创建
  const blankFocusRelatedTargetRef = useRef(null)
  const handleBlankFocus = e => {
    blankFocusRelatedTargetRef.current = e?.relatedTarget
  }
  const handleBlankClick = () => {
    if (blankFocusRelatedTargetRef.current?.nodeName === 'INPUT') {
      return (blankFocusRelatedTargetRef.current = null)
    }
    handlePlusClick()
  }
  // 回车创建
  // 只有手动排序时 回车可以在中间插入，使用排序后的 但未经过滤的reminders计算
  // 其他排序 都在末尾插入
  const handleKeyEnter = index => {
    const sortedReminders = [...reminders].sort((a, b) => a.order - b.order)
    const order =
      currentList.sortType === 'Manual' && sortedReminders[index + 1]
        ? (sortedReminders[index].order + sortedReminders[index + 1].order) / 2
        : getNextOrder(sortedReminders)

    crateEmptyCacheReminder(currentListId, order)
  }

  const { mutate: createReminder } = useCreateReminder()
  const handleReminderCreate = reminder => {
    createReminder({ ...reminder })
  }

  // 删除 list
  const { mutate: deleteList } = useDeleteList()
  const confirm = useConfirm()
  const handleDeleteListBtnClick = async () => {
    const result = await confirm({ title: 'Are you sure?' })
    if (result) await deleteList(currentListId)
  }
  // 更新 list
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const handleListInfoBtnClick = () => setIsDialogOpen(true)

  // 多选
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [selectedReminderIds, setSelectedReminderIds] = useState([])
  const handleSelectBtnClick = () => {
    setIsSelectMode(true)
  }
  const handleDoneBtnClick = () => {
    setIsSelectMode(false)
    setSelectedReminderIds([])
  }
  // 推入或移除 selectedReminderIds，并根据 sortedReminders 重新排序
  const handleItemClick = id => {
    const isSelected = selectedReminderIds.includes(id)
    const ids = isSelected
      ? selectedReminderIds.filter(selectedId => selectedId !== id)
      : [...selectedReminderIds, id]
    const sortedReminders = [...reminders].sort((a, b) => a.order - b.order)
    const sortedIds = sortedReminders.filter(r => ids.includes(r.id)).map(r => r.id)
    setSelectedReminderIds(sortedIds)
  }

  // 批量删除
  const { mutate: deleteReminders } = useDeleteReminders()
  const handleBatchDeleteClick = async () => {
    const result = await confirm({ title: 'Are you sure?' })
    if (!result) return
    deleteReminders(
      {
        reminderIds: selectedReminderIds,
        currentListId,
      },
      {
        onSuccess: () => {
          setIsSelectMode(false)
          setSelectedReminderIds([])
        },
      }
    )
  }

  // 批量完成
  const { mutate: completeReminders } = useCompleteReminders()
  const handleBatchCompleteClick = () => {
    completeReminders(
      {
        reminderIds: selectedReminderIds,
        currentListId,
      },
      {
        onSuccess: () => {
          setIsSelectMode(false)
          setSelectedReminderIds([])
        },
      }
    )
  }

  // 批量移动
  const { mutate: moveReminders } = useMoveReminders()
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false)
  const handleDialogMove = targetListId => {
    moveReminders(
      {
        updates: [...selectedReminderIds.map(id => ({ id, targetListId }))],
        currentListId,
        targetListId,
        reminderIds: selectedReminderIds,
      },
      {
        onSuccess: () => {
          setIsMoveDialogOpen(false)
          setIsSelectMode(false)
          setSelectedReminderIds([])
        },
      }
    )
  }

  // 切换 filter
  const handleFilterBtnClick = () => {
    if (filter === 'All') setFilter('Pending')
    else setFilter('All')
  }
  const filteredReminders = reminders.filter(reminder => {
    if (filter === 'All') return true
    if (filter === 'Pending') return !reminder.completed
  })

  // 排序
  const sortTypes = ['CreatedAt', 'Title', 'Manual']
  const { mutate: updateList } = useUpdateList()
  const handleSortTypeBtnClick = type => updateList({ ...currentList, sortType: type })

  const getFilteredSortedReminders = () => {
    if (currentList?.sortType === 'Title')
      return [...filteredReminders].sort((a, b) => {
        // Title 排序时，新建的空 reminder 放在最下面
        if (a.title === '' && a.id.indexOf('temp-new') !== -1) return 1
        return a.title.localeCompare(b.title)
      })
    if (currentList?.sortType === 'Manual') {
      return [...filteredReminders].sort((a, b) => a.order - b.order)
    }
    return filteredReminders
  }
  const filteredSortedReminders = getFilteredSortedReminders()

  // Move Btn  moveClick
  const handleMoveClick = (index, reminder, delta) => {
    const prev = filteredSortedReminders[index + delta * 2]
    const next = filteredSortedReminders[index + delta]

    let newOrder
    if (!prev) newOrder = next.order + delta * 100
    else newOrder = (prev.order + next.order) / 2

    updateReminder({ ...reminder, order: newOrder })
  }

  // 提醒
  const { mutate: updateReminder } = useUpdateReminder()
  useEffect(() => {
    if (Notification.permission === 'default') Notification.requestPermission()
  }, [])
  useEffect(() => {
    const check = () => {
      const now = Date.now()
      reminders.forEach(r => {
        if (!r.notified && new Date(r.date + ' ' + r.time).getTime() <= now) {
          new Notification('Reminder', { body: r.title })
          updateReminder({ ...r, notified: true })
        }
      })
    }

    const timer = setInterval(check, 30 * 1000)
    check()
    return () => clearInterval(timer)
  }, [reminders, updateReminder])

  if (!currentListId)
    return (
      <Empty>
        <EmptyContent>
          <EmptyHeader>
            <EmptyTitle>Did Not Select Any List.</EmptyTitle>
          </EmptyHeader>
        </EmptyContent>
      </Empty>
    )
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Spinner />
      </div>
    )
  if (error) return <div>Error: {error.message}</div>

  // Reminder = 完整 UI

  // 谁拥有数据，谁实现逻辑
  // 在哪点击，就在哪调用
  // 调用 != 实现逻辑

  const curentListColor = colorMap[currentList?.color]

  let remindersContent = ''
  let emptyContent = ''
  if (filteredSortedReminders.length) {
    remindersContent = (
      <div className="flex flex-col w-full">
        {filteredSortedReminders.map((reminder, index) => (
          <Reminder
            key={reminder.id}
            reminder={reminder}
            isSelectMode={isSelectMode}
            isSelected={selectedReminderIds.includes(reminder.id)}
            onSelectClick={() => handleItemClick(reminder.id)}
            onReminderCreate={handleReminderCreate}
            onMoveClick={delta => handleMoveClick(index, reminder, delta)}
            hasPrev={index > 0}
            hasNext={index < filteredSortedReminders.length - 1}
            onKeyEnter={() => handleKeyEnter(index)}
            sortType={currentList.sortType}
          />
        ))}
      </div>
    )
  } else {
    // 最终 reminders 为空的情况
    if (reminders.length === 0)
      emptyContent = (
        <Empty>
          <EmptyContent>
            <EmptyHeader>
              <EmptyTitle>No Reminders.</EmptyTitle>
            </EmptyHeader>
          </EmptyContent>
        </Empty>
      )
    else if (reminders.length > 0) emptyContent = 'All Completed'
  }
  return (
    <div className="Reminders h-full w-full flex flex-col py-2 px-4">
      {/* header */}
      <div className="flex justify-between text-xl">
        {/* list name */}
        <h1 className="font-bold" style={{ color: curentListColor }}>
          {isSelectMode ? `${selectedReminderIds.length} Selected` : currentList?.name}
        </h1>
        {/* 右侧按钮 */}
        {isSelectMode ? (
          <Button variant="ghost" onClick={handleDoneBtnClick}>
            Done
          </Button>
        ) : (
          <ButtonGroup>
            <Button variant="ghost" size="icon" onClick={handlePlusClick}>
              <Plus />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <MoreHorizontalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleListInfoBtnClick}>
                    <Info />
                    Show List Info
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSelectBtnClick}>
                    <CheckIcon />
                    Select
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <ArrowDownUp />
                      Sort
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup
                          value={currentList.sortType}
                          onValueChange={handleSortTypeBtnClick}>
                          {sortTypes.map(type => (
                            <DropdownMenuRadioItem key={type} value={type}>
                              {type}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem onClick={handleFilterBtnClick}>
                    {filter === 'All' ? (
                      <>
                        <EyeOff />
                        Hidden Completed
                      </>
                    ) : (
                      <>
                        <Eye />
                        Show Completed
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem variant="destructive" onClick={handleDeleteListBtnClick}>
                    <TrashIcon />
                    Delete List
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </ButtonGroup>
        )}
      </div>
      {/* reminders */}
      {remindersContent}
      {/* reminders 底部空白 */}
      <div
        className="flex-1 flex"
        tabIndex={0}
        id="blank"
        onClick={handleBlankClick}
        onFocus={e => handleBlankFocus(e)}>
        {emptyContent}
      </div>
      {/* 批量操作 */}
      {isSelectMode && selectedReminderIds.length > 0 && (
        // <div>
        <ButtonGroup className="flex justify-between fixed bottom-0 right-0 left-[280px] gap-0.5 w-auto">
          <Button className="flex-1" variant="outline" onClick={() => setIsMoveDialogOpen(true)}>
            Move
          </Button>
          <Button className="flex-1" variant="outline" onClick={handleBatchDeleteClick}>
            Delete
          </Button>
          <Button className="flex-1" variant="outline" onClick={handleBatchCompleteClick}>
            Complete
          </Button>
        </ButtonGroup>
        // </div>
      )}
      {/* 编辑 List */}
      <ListInfoForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        info={currentList}
        key={currentListId}></ListInfoForm>

      {/* 移动弹窗 */}
      <MoveDialog
        open={isMoveDialogOpen}
        onOpenChange={setIsMoveDialogOpen}
        lists={lists}
        currentListId={currentListId}
        onMove={handleDialogMove}></MoveDialog>
    </div>
  )
}

export default Reminders
