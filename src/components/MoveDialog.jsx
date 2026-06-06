import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'

const MoveDialog = ({ open, lists, currentListId, onOpenChange, onMove }) => {
  const [selectedListId, setSelectedListId] = useState(null)

  const handleFinishClick = () => {
    if (selectedListId) {
      onMove(selectedListId)
    }
  }

  return (
    <Dialog className="MoveDialog" open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select list</DialogTitle>
        </DialogHeader>
        <RadioGroup value={selectedListId} className="max-w-sm" onValueChange={setSelectedListId}>
          {lists
            .filter(list => list.id !== currentListId)
            .map(list => (
              <FieldLabel htmlFor={list.id} key={list.id}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{list.name}</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value={list.id} id={list.id} />
                </Field>
              </FieldLabel>
            ))}
        </RadioGroup>
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

export default MoveDialog
