import {
  useAlbumNew,
  useAlbumNewest,
  useBanner,
  useRecommendSongs,
  useRecordRecentAlbum,
  useToplist,
} from '../services/music'
import { useNavigate } from 'react-router-dom'
import HorizenScroll from '../components/HorizenScroll'
import Loading from '../libs/Loading'
import ImgLazy from '../components/ImgLazy'
const Home = () => {
  console.log('console: home render')
  const { data: bannerData, isLoading: bannerLoading, error: bannerError } = useBanner()
  const banners = bannerData?.banners || []

  const {
    data: recommendSongsData,
    isLoading: recommendSongsLoading,
    error: recommendSongsError,
  } = useRecommendSongs()
  const dailySongs = recommendSongsData?.data.dailySongs || []
  const _dailySongs = []
  for (let i = 0; i < dailySongs.length; i += 3) {
    _dailySongs.push(dailySongs.slice(i, i + 3))
  }

  const {
    data: albumNewData,
    isLoading: albumNewLoading,
    error: albumNewError,
  } = useAlbumNew({ area: 'ALL', offset: 0, limit: 12 })
  console.log('console: albumNewData', albumNewData)
  const albumsNew = albumNewData?.pages[0]?.albums || []

  const {
    data: albumNewestData,
    isLoading: albumNewestLoading,
    error: albumNewestError,
  } = useAlbumNewest()
  const albumsNewest = albumNewestData?.albums || []

  const { data: toplistData, isLoading: toplistLoading, error: toplistError } = useToplist()
  const toplists = toplistData?.list.slice(0, 12) || []

  const {
    data: recentAlbumData,
    isLoading: recentAlbumLoading,
    error: recentAlbumError,
  } = useRecordRecentAlbum({ limit: 12 })
  const recentAlbums = (recentAlbumData?.pages[0]?.data?.list || []).map(r => r.data)

  const navigate = useNavigate()

  const handleBannerClick = url => {
    if (url.startsWith('http')) {
      window.open(url, '_blank')
    } else {
      navigate(url.replace('orpheus:/', ''))
    }
  }

  if (
    bannerLoading ||
    recommendSongsLoading ||
    albumNewLoading ||
    albumNewestLoading ||
    toplistLoading ||
    recentAlbumLoading
  )
    return <Loading />
  return (
    <div className="space-y-4 p-1 overflow-y-auto h-full">
      <HorizenScroll
        loading={bannerLoading}
        itemMinWidth={500}
        list={banners}
        renderItem={(album, style) => {
          return (
            <div style={style} className="shrink-0 mx-0.5" key={album.id}>
              <div className="mb-1.5">{album.typeTitle}</div>
              <div className="aspect-5/2" onClick={() => handleBannerClick(album.url)}>
                <ImgLazy
                  className="w-full h-full object-cover"
                  src={`${album.imageUrl}?param=300y300`}
                  alt={album.typeTitle}
                />
              </div>
            </div>
          )
        }}
      />
      <HorizenScroll
        loading={recentAlbumLoading}
        title="最近播放"
        titlePath={'/recent-albums'}
        list={recentAlbums}
        renderItem={(album, style) => (
          <div
            style={style}
            className="shrink-0 mx-0.5"
            key={album.id}
            onClick={() => navigate(`/album/${album.id}`)}>
            <div>
              <ImgLazy
                className="w-full aspect-square object-cover"
                src={`${album.blurPicUrl}?param=300y300`}
                alt={album.name}
              />
            </div>
            <div className="text-sm mt-1">
              <div className="line-clamp-2 wrap-break-word">{album.name}</div>
              <div className="line-clamp-2 wrap-break-word">{album.artist.name}</div>
            </div>
          </div>
        )}
      />
      <HorizenScroll
        loading={albumNewLoading}
        title="新碟上架"
        titlePath={'/new-albums'}
        list={albumsNew}
        renderItem={(album, style) => (
          <div
            style={style}
            className="shrink-0 mx-0.5"
            key={album.id}
            onClick={() => navigate(`/album/${album.id}`)}>
            <div>
              <ImgLazy
                className="w-full aspect-square object-cover"
                src={`${album.blurPicUrl}?param=300y300`}
                alt={album.name}
              />
            </div>
            <div className="text-sm mt-1">
              <div className="line-clamp-2 wrap-break-word">{album.name}</div>
              <div className="line-clamp-2 wrap-break-word">{album.artist.name}</div>
            </div>
          </div>
        )}
      />
      <HorizenScroll
        loading={albumNewestLoading}
        title="最新专辑"
        list={albumsNewest}
        renderItem={(album, style) => (
          <div
            style={style}
            className="shrink-0 mx-0.5"
            key={album.id}
            onClick={() => navigate(`/album/${album.id}`)}>
            <div>
              <ImgLazy
                className="w-full aspect-square object-cover"
                src={`${album.blurPicUrl}?param=300y300`}
                alt={album.name}
              />
            </div>
            <div className="text-sm mt-1">
              <div className="line-clamp-2 wrap-break-word">{album.name}</div>
              <div className="line-clamp-2 wrap-break-word">{album.artist.name}</div>
            </div>
          </div>
        )}
      />
      <HorizenScroll
        loading={recommendSongsLoading}
        title="推荐歌曲"
        list={_dailySongs}
        renderItem={(song, style) => (
          <div style={{ width: 'calc(33.3333% - 0.25rem)' }} className="shrink-0 mx-0.5">
            {song.map(s => (
              <div
                className="flex items-center gap-1 space-y-1"
                key={s.id}
                onClick={() => navigate(`/album/${s.al.id}`)}>
                <div className="w-8 h-8">
                  <ImgLazy
                    src={`${s.al.picUrl}?param=300y300`}
                    className="w-full h-full object-cover shrink-0"
                    alt={s.name}
                  />
                </div>
                <div className="flex flex-col flex-1 text-xs justify-between w-0">
                  <div className="truncate min-w-0">{s.name}</div>
                  <div className="truncate min-w-0">{s.ar.map(a => a.name).join('/')}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      />
      <HorizenScroll
        loading={toplistLoading}
        title="榜单"
        list={toplists}
        titlePath={'/toplist'}
        renderItem={(list, style) => (
          <div
            style={style}
            className="shrink-0 mx-0.5"
            key={list.id}
            onClick={() => navigate(`/playlist/${list.id}`)}>
            <div>
              <ImgLazy
                className="w-full aspect-square object-cover"
                src={`${list.coverImgUrl}?param=300y300`}
                alt={list.name}
              />
            </div>
            <div className="text-sm mt-1">
              <div className="line-clamp-2 wrap-break-word">{list.name}</div>
            </div>
          </div>
        )}
      />
    </div>
  )
}

export default Home
