import { useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PopoverTrigger, PopoverContent, Popover } from './ui/popover'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from './ui/input'
import { Calendar } from './ui/calendar'
import { useUpdateReminder } from '../hooks/useReminders'
import { ChevronDownIcon } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

const ReminderInfoForm = ({ reminder, open, onOpenChange }) => {
  const { title: initialTitle, date: initialDate, time: initialTime, notified, ...rest } = reminder
  const [title, setTitle] = useState(initialTitle)
  const [date, setDate] = useState(initialDate ?? new Date().toLocaleDateString())
  const [time, setTime] = useState(initialTime ?? new Date().toLocaleTimeString())

  const [isRemind, setIsRemind] = useState(initialDate ? true : false)

  const { mutate: updateReminder } = useUpdateReminder()

  const handleDateSelect = selectedDate => setDate(selectedDate.toLocaleDateString())

  const handleFinishClick = () => {
    if (!isRemind) return updateReminder({ ...rest, title })
    const isNotified = new Date(date + ' ' + time).getTime() <= Date.now()
    updateReminder({ ...reminder, title, date, time, notified: isNotified })
  }

  return (
    <Dialog className="ReminderInfoForm" open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reminder Info</DialogTitle>
        </DialogHeader>
        <FieldGroup className="gap-1.5">
          <Field>
            <Input type="text" value={title} onChange={e => setTitle(e.target.value)} />
          </Field>
          <Field orientation="horizontal">
            <FieldLabel>Remind me</FieldLabel>
            <Switch checked={isRemind} onCheckedChange={setIsRemind} />
          </Field>
          {isRemind && (
            <FieldGroup className="gap-1!">
              <Field orientation="horizontal">
                <FieldLabel htmlFor="date-picker-optional">Date</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" id="date-picker-optional" className="w-30">
                      {date || 'Select date'}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={handleDateSelect}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
              <Field orientation="horizontal">
                <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
                <Input
                  type="time"
                  id="time-picker-optional"
                  className="w-30"
                  step="1"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                />
              </Field>
            </FieldGroup>
          )}
          {/* <p>List: {list?.name}</p> */}
        </FieldGroup>
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

export default ReminderInfoForm
