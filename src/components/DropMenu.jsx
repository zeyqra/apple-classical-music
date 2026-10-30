import useStore from '../store'
import Dropdown from './Dropdown'
// 专辑 | 播放列表 | 曲目 | 录音
// 播放
// 添加到资料库
// 添加到播放列表
// 分享曲目|录音|专辑 | 播放列表
// 拷贝链接
// 前往专辑
// 前往作品
// 个人收藏

const DropMenu = ({ type, albumId, trackIds, playFn }) => {
  const libraryTrackIds = useStore(state => state.libraryTrackIds)
  const addTracksToLibrary = useStore(state => state.addTracksToLibrary)
  const removeTracksFromLibrary = useStore(state => state.removeTracksFromLibrary)

  const handleAddToLibrary = () => {
    // if (type === 'track') {
    addTracksToLibrary({ albumId, trackIds })
    // } else if (type === 'album') {
    //   addTracksToLibrary({ albumId, trackIds: trackIds })
    // }
  }
  const handleRemoveFromLibrary = () => {
    removeTracksFromLibrary({ albumId, trackIds: trackIds })
  }

  let isInLibrary = false
  if (type === 'track') {
    isInLibrary = libraryTrackIds.get(albumId)?.has(trackIds[0])
  } else if (type === 'album') {
    isInLibrary = libraryTrackIds.get(albumId)?.size > 0
  }
  return (
    <Dropdown
      trigger={<button>...</button>}
      menu={
        <div>
          {playFn && <div onClick={playFn}>播放</div>}
          {isInLibrary ? (
            <div onClick={handleRemoveFromLibrary}>从资料库删除</div>
          ) : (
            <div onClick={handleAddToLibrary}>添加到资料库</div>
          )}

          {/* <div>添加到播放列表</div>
          <div>个人收藏</div> */}
        </div>
      }></Dropdown>
  )
}

export default DropMenu
