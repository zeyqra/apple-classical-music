import useStore from '../store.js'
import Queue from './Queue'

const SideBar = () => {
  const sbType = useStore(state => state.sbType)
  let content = null
  if (sbType === 'queue') {
    content = <Queue></Queue>
  }

  return (
    <div className="h-full w-full border-l border-zinc-500">
      <div
        className={`${sbType === 'queue' ? 'translate-x-0' : 'translate-x-30'} transition-transform`}>
        {content}
      </div>
    </div>
  )
}

export default SideBar
