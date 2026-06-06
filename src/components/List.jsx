import { MoreHorizontalIcon, Trash } from 'lucide-react'
import { iconMap, colorMap } from '../utils/maps'
import { usePrefetchReminders } from '../hooks/useReminders.js'
import { useDeleteList } from '../hooks/useLists.js'
import { useConfirm } from '../hooks/useConfirm.jsx'
import { Button } from './ui/button'
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item'
import ListIcon from './ListIcon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Separator } from './ui/separator'

const List = ({ list, isActive, onClick }) => {
  const { id, name, icon, color } = list
  const Icon = iconMap[icon]
  const listColor = colorMap[color]

  const prefetchReminders = usePrefetchReminders()

  // 删除 list
  const { mutate: deleteList } = useDeleteList()
  const confirm = useConfirm()
  const handleDeleteClick = async listId => {
    const result = await confirm({ title: 'Are you sure?' })
    if (result) deleteList(listId)
  }
  return (
    <Item
      onClick={onClick}
      size="xs"
      className={`ListItem group cursor-default px-2 py-1
      ${isActive ? 'bg-zinc-100 dark:bg-zinc-700' : ''}`}>
      <ItemMedia variant="icon">
        <ListIcon icon={Icon} color={listColor} size={22} iconSize={15} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{name}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="opacity-0 group-hover:opacity-100">
            <Button variant="ghost">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive" onClick={() => handleDeleteClick(id)}>
                <Trash size={15} />
                Delete list
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
    // <div
    //   className={`list group cursor-default
    //   flex items-center justify-between
    //   hover:bg-zinc-100 dark:hover:bg-zinc-700
    //   px-2 py-0.5
    //   ${isActive ? 'bg-zinc-100 dark:bg-zinc-700' : ''}`}
    //   onClick={onClick}
    //   onMouseEnter={() => prefetchReminders(id)}>
    //   <div className="flex items-center gap-2">
    //     <ListIcon icon={Icon} color={listColor} size={22} iconSize={15} />
    //     <span>{name}</span>
    //   </div>
    //   <Button
    //     variant="ghost"
    //     size="icon"
    //     className="opacity-0 group-hover:opacity-100"
    //     onClick={() => handleDeleteClick(id)}>
    //     <Trash size={15} />
    //   </Button>
    // </div>
  )
}

export default List
