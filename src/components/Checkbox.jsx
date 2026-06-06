import { Circle, CircleCheck } from 'lucide-react'

const Checkbox = ({ checked, onChange }) => {
  return <div onClick={onChange}>{checked ? <CircleCheck size={24} /> : <Circle size={24} />}</div>
}

export default Checkbox
