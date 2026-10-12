import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useSearch, useSearchHot } from '../services/music'
import HorizenScroll from '../components/HorizenScroll'
import Loading from '../libs/Loading'
import ImgLazy from '../components/ImgLazy'

const Search = () => {
  const [searchParams] = useSearchParams()
  const keywords = searchParams.get('keywords')
  const {
    data: searchResult,
    isFetchingNextPage,
    isLoading: searchLoading,
  } = useSearch({
    keywords,
    type: 1018,
  })
  const { album, artist, song, playlist, user } = searchResult?.pages[0]?.result || {}
  const songs = song?.songs || []
  const _songs = []
  for (let i = 0; i < songs.length; i += 3) {
    _songs.push(songs.slice(i, i + 3))
  }
  const albums = album?.albums || []
  const artists = artist?.artists || []

  const { data: hotData, isLoading: hotLoading } = useSearchHot()
  const hots = hotData?.result?.hots || []

  const recentlySearched = JSON.parse(localStorage.getItem('recentlySearched') || '[]')

  const navigate = useNavigate()

  if (searchLoading) return <Loading />

  return (
    <div className="flex flex-col gap-2 p-2 h-full overflow-y-auto">
      {keywords ? (
        <div className="space-y-8">
          <HorizenScroll
            title="Albums"
            titlePath={'/search/albums?keywords=' + keywords}
            list={albums}
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
            title="Songs"
            titlePath={'/search/songs?keywords=' + keywords}
            list={_songs}
            renderItem={song => (
              <div style={{ width: 'calc(33.3333% - 0.25rem)' }} className="shrink-0 mx-0.5">
                {song.map(s => (
                  <div
                    className="flex items-center gap-1 space-y-1"
                    key={s.id}
                    onClick={() => navigate(`/album/${s.al.id}`)}>
                    <ImgLazy
                      src={`${s.al.picUrl}?param=180y180`}
                      className="w-8 h-8"
                      alt={s.name}
                    />
                    <div className="flex flex-col flex-1 text-xs">
                      <span>{s.name}</span>
                      <span>{s.ar.map(a => a.name).join('/')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          />
          <HorizenScroll
            title="Artists"
            titlePath={'/search/artists?keywords=' + keywords}
            list={artists}
            renderItem={artist => (
              <div
                style={{ width: 'calc(12.5% - 0.25rem)' }}
                className="shrink-0 mx-0.5"
                key={artist.id}>
                <ImgLazy
                  className="aspect-square w-full object-cover rounded-full"
                  src={`${artist.picUrl}?param=300y300`}
                  alt={artist.name}
                />
                <div className="text-center mt-1">{artist.name}</div>
              </div>
            )}
          />
        </div>
      ) : (
        <div>
          {recentlySearched.length > 0 && (
            <div>
              <h2 className="text-lg font-bold my-2">最近搜索</h2>
              <div className="grid grid-cols-3 gap-1">
                {recentlySearched.map(item => (
                  <NavLink
                    className="block"
                    key={item.id}
                    to={`/album/${item.album?.id || item.id}`}>
                    <div>{item.name}</div>
                    <div className="text-sm">
                      {item.type === 'album' ? '专辑' : item.type === 'song' ? '歌曲' : item.type} ·{' '}
                      {item?.artists?.map(a => a.name).join('/') || item?.artist?.name || ''}
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          )}
          {!hotLoading && (
            <div>
              <h2 className="text-lg font-bold mb-2 mt-4">热门搜索</h2>
              <div className="grid grid-cols-3 gap-1 border-zinc-300">
                {hots.map(hot => (
                  <NavLink key={hot.first} to={`/search?keywords=${hot.first}`}>
                    {hot.first}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Search
