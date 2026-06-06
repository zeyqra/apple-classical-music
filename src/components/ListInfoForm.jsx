import { useState } from 'react'
import { useCreateList, useUpdateList } from '../hooks/useLists.js'
import { iconMap, colorMap } from '../utils/maps.js'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from '@/components/ui/dialog'
import ListIcon from './ListIcon'
import { Input } from './ui/input.jsx'

const initialDetails = { name: 'New List', icon: 'List', color: 'pink', sortType: 'CreatedAt' }
const ListInfoForm = ({ open, onOpenChange, info }) => {
  const [details, setDetails] = useState(info || initialDetails)
  const { mutate: createList } = useCreateList()
  const { mutate: updateList } = useUpdateList()

  // 完成
  const handleFinishClick = () => {
    if (info) updateList(details)
    else createList({ ...details, id: 'temp-new' + Date.now().toString() })
  }

  const handleOpenChange = newOpen => {
    console.log('console: info', info)
    if (newOpen && info) setDetails(info)
    if (!newOpen) setDetails(initialDetails)
    onOpenChange(newOpen)
  }

  const IconComponent = iconMap[details.icon]
  const color = colorMap[details.color]
  return (
    <Dialog className="ListInfoForm" open={open} onOpenChange={handleOpenChange}>
      {/* <DialogTrigger asChild>
        <Button className="fixed bottom-0 left-0 w-70" variant="outline">
          New List
        </Button>
      </DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{info?.name || 'New List'} Info</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="flex justify-center">
            {/* Icon */}
            {/* <IconComponent size={48} style={{ color }} /> */}
            <ListIcon icon={IconComponent} color={color} size={70} iconSize={50} />
          </div>
          {/* name input */}
          <Input
            className={`border border-zinc-100 w-full dark:border-zinc-800 mb-2`}
            style={{ color }}
            type="text"
            value={details.name}
            onChange={e => setDetails({ ...details, name: e.target.value })}
          />
          {/* colors */}
          <div className="flex gap-1  mb-2">
            {Object.entries(colorMap).map(([colorName, colorValue]) => {
              return (
                <div
                  className={`w-8 h-8 ${details.color === colorName ? 'outline-2 outline-zinc-500' : ''}`}
                  style={{ backgroundColor: colorValue }}
                  key={colorName}
                  onClick={() => setDetails({ ...details, color: colorName })}></div>
              )
            })}
          </div>
          {/* Icons */}
          <div className="flex gap-1  mb-2">
            {Object.entries(iconMap).map(([iconName, Icon]) => {
              return (
                <Icon
                  size={32}
                  className={details.icon === iconName ? 'outline-2 outline-gray-500' : ''}
                  key={iconName}
                  onClick={() => setDetails({ ...details, icon: iconName })}
                />
              )
            })}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleFinishClick}>Finish</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ListInfoForm
