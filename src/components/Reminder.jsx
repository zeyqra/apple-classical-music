import { useEffect, useRef, useState } from 'react'
import useDebounce from '../hooks/useDebounce'
import Checkbox from './Checkbox'
import {
  useDeleteReminder,
  useRemoveEmptyCacheReminder,
  useUpdateReminder,
} from '../hooks/useReminders'
import { ChevronUp, ChevronDown, Info } from 'lucide-react'
import ReminderInfoForm from './ReminderInfoForm'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
  ItemDescription,
} from '@/components/ui/item'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
const Reminder = ({
  reminder,
  isSelectMode,
  isSelected,
  onSelectClick,
  onMoveClick,
  onReminderCreate,
  hasPrev,
  hasNext,
  onKeyEnter,
  sortType,
}) => {
  const { id, title: _title, completed: _completed, listId, date, time, notified } = reminder
  const [title, setTitle] = useState(_title)
  const [completed, setCompleted] = useState(_completed)

  const removeEmptyCacheReminder = useRemoveEmptyCacheReminder()
  const { mutate: updateReminder } = useUpdateReminder()
  const { mutate: deleteReminder } = useDeleteReminder()
  const debouncedUpdate = useDebounce(updateReminder, 500)

  // 新創建的自动获取焦点
  const inputRef = useRef(null)
  useEffect(() => {
    if (String(id).indexOf('temp-new') !== -1) {
      inputRef.current.focus()
    }
  }, [id])

  // 批量完成的情況 同步 completed prop
  useEffect(() => {
    setCompleted(_completed)
  }, [_completed])
  // info 更新 reminder
  useEffect(() => {
    setTitle(_title)
  }, [_title])

  // 失焦会触发：创建 更新 删除
  const hanleOnBlur = () => {
    const isEmpty = !title.trim()
    if (String(id).indexOf('temp-new') !== -1) {
      if (!isEmpty) onReminderCreate({ ...reminder, title })
      else removeEmptyCacheReminder(listId, reminder)
    } else {
      if (!isEmpty && title.trim() !== _title) updateReminder({ ...reminder, title })
      else if (isEmpty) deleteReminder(reminder)
    }
  }
  const handleCompletedChange = () => {
    setCompleted(prev => {
      debouncedUpdate({ ...reminder, completed: !prev })
      return !prev
    })
  }
  // Move Btn  onMoveClick
  const handleMoveClick = (e, delta) => {
    e.stopPropagation()
    onMoveClick(delta)
  }
  // EnterKey  onKeyEnter
  const handleKeyDown = e => {
    if (e.key !== 'Enter') return

    e.target.blur()
    if (!title.trim()) return // 空内容回车：失焦，什么也不做
    onKeyEnter()
  }
  // Reminder Info  Update
  const [reminderInfoDialogOpen, setReminderInfoDialogOpen] = useState(false)
  return (
    // <Item onClick={() => isSelectMode && onSelectClick()} className="group">
    //   {/* <ItemMedia variant="icon"> */}
    //   {/* 多选模式 checkbox */}
    //   {isSelectMode && <Checkbox checked={isSelected} />}
    //   {/* completed checkbox */}
    //   {!isSelectMode && <Checkbox checked={completed} onChange={handleCompletedChange}></Checkbox>}
    //   {/* </ItemMedia> */}
    //   <ItemContent>
    //     {/* title input：onChange onBlur onKeyDown */}
    //     <ItemTitle className="w-full">
    //       <Input
    //         ref={inputRef}
    //         className={`${isSelectMode ? 'pointer-events-none' : ''}`}
    //         type="text"
    //         value={title}
    //         onChange={e => setTitle(e.target.value)}
    //         onBlur={hanleOnBlur}
    //         onKeyDown={e => handleKeyDown(e)}
    //       />
    //     </ItemTitle>
    //     {date && (
    //       <ItemDescription className={`${notified ? 'text-red-500' : 'text-zinc-500'}`}>
    //         {date} {time}
    //       </ItemDescription>
    //     )}
    //   </ItemContent>
    //   <ItemActions>
    //     {/* reminder info btn */}
    //     <Button
    //       size="sm"
    //       variant="ghost"
    //       className="hidden group-hover:block"
    //       onClick={() => setReminderInfoDialogOpen(true)}>
    //       <Info size={20} />
    //     </Button>
    //     {/* 移动按钮 */}
    //     {isSelectMode && sortType === 'Manual' && (
    //       <button onClick={e => handleMoveClick(e, -1)} disabled={!hasPrev}>
    //         <ChevronUp size={20} />
    //       </button>
    //     )}
    //     {isSelectMode && sortType === 'Manual' && (
    //       <button onClick={e => handleMoveClick(e, 1)} disabled={!hasNext}>
    //         <ChevronDown size={20} />
    //       </button>
    //     )}
    //   </ItemActions>
    //   {/* ReminderInfo弹窗 */}
    //   <ReminderInfoForm
    //     reminder={reminder}
    //     open={reminderInfoDialogOpen}
    //     onOpenChange={setReminderInfoDialogOpen}
    //     key={reminder.id}
    //   />
    // </Item>

    <div className="flex gap-2 w-full group pt-1" onClick={() => isSelectMode && onSelectClick()}>
      {/* 多选模式 checkbox */}
      {isSelectMode && <Checkbox checked={isSelected} />}
      {/* completed checkbox */}
      {!isSelectMode && <Checkbox checked={completed} onChange={handleCompletedChange}></Checkbox>}

      <div className="flex-1 flex flex-col">
        <div className="flex items-center">
          {/* title input：onChange onBlur onKeyDown */}

          <div className="flex-1">
            <input
              ref={inputRef}
              className={`text-[18px] w-full outline-0 ${isSelectMode ? 'pointer-events-none' : ''}`}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={hanleOnBlur}
              onKeyDown={e => handleKeyDown(e)}
            />
          </div>
          {/* reminder info btn */}
          {!isSelectMode && (
            <Button
              variant="ghost"
              className="invisible group-hover:visible"
              onClick={() => setReminderInfoDialogOpen(true)}>
              <Info size={20} />
            </Button>
          )}
          {/* 移动按钮 */}
          {isSelectMode && sortType === 'Manual' && (
            <Button variant="ghost" onClick={e => handleMoveClick(e, -1)} disabled={!hasPrev}>
              <ChevronUp size={20} />
            </Button>
          )}
          {isSelectMode && sortType === 'Manual' && (
            <Button variant="ghost" onClick={e => handleMoveClick(e, 1)} disabled={!hasNext}>
              <ChevronDown size={20} />
            </Button>
          )}
          {/* ReminderInfo弹窗 */}
          <ReminderInfoForm
            reminder={reminder}
            open={reminderInfoDialogOpen}
            onOpenChange={setReminderInfoDialogOpen}
            key={reminder.id}
          />
        </div>
        {date && (
          <div className={`-mt-0.5 ${notified ? 'text-red-500' : 'text-zinc-500'}`}>
            {date} {time}
            {/* {formatDueAt(dueAt)} */}
          </div>
        )}
        <Separator className="mt-1" />
      </div>
    </div>
  )
}

export default Reminder
