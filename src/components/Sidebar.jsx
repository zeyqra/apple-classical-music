import useAppStore from '../stores/useAppStore'
import useMusicStore from '../stores/useMusicStore'

const SideBar = () => {
  const sbType = useAppStore(state => state.sbType)
  const queue = useMusicStore(state => state.queue) // 默认 []
  const index = useMusicStore(state => state.index) // 默认 0

  let content = null
  if (sbType === 'queue') {
    content = (
      <div>
        <h2>Queue</h2>
        <div>
          {queue.slice(index + 1).map(song => (
            <div key={song.id} className="text-sm flex items-center gap-1">
              <img className="w-8 h-8" src={song.alPicUrl} alt="song cover" />
              <div className="w-[calc(280px-36px)]">
                <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
                  {song.name}
                </div>
                <div className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
                  {song.artists}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  } else if (sbType === 'lyric') {
    content = <div>歌词</div>
  }

  return <div>{content}</div>
}

export default SideBar
