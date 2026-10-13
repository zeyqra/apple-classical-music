import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import useAppStore from '../stores/app'
import { useSearchSuggest } from '../services/music'
import { useDebounce } from '../hooks'

const Search = () => {
  const [searchText, setSearchText] = useState('')
  const [showSug, setShowSug] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchKeywords = useAppStore(state => state.searchKeywords)
  const setSearchKeywords = useAppStore(state => state.setSearchKeywords)

  const handleChange = e => {
    setSearchText(e.target.value)
    setShowSug(true)
  }

  const handleFocus = () => {
    setShowSug(true)
    const isSearchPath = location.pathname.includes('/search')
    // 如果当前就在搜索页，什么都不做
    if (isSearchPath) return
    if (!isSearchPath) {
      navigate('/search' + (searchKeywords ? `?keywords=${searchKeywords}` : ''))
    }
  }

  const handleKeydown = e => {
    if (e.key === 'Enter') {
      setSearchKeywords(searchText)
      setSearchParams({ keywords: searchText })
    }
  }

  const dSt = useDebounce(searchText, 300)
  const { data: suggestDataKY } = useSearchSuggest({
    keywords: dSt,
    type: 'mobile',
    show: showSug,
  })
  const { data: suggestData } = useSearchSuggest({ keywords: dSt, show: showSug })
  const sugsKeyword = suggestDataKY?.result?.allMatch || []
  const sugsAl = suggestData?.result?.albums || []
  const sugsSo = suggestData?.result?.songs || []
  const sugsAr = suggestData?.result?.artists || []
  const handleSugClick = keyword => {
    setShowSug(false)
    setSearchText(keyword)
    setSearchKeywords(keyword)
    setSearchParams({ keywords: keyword })
  }
  const handleSugAlSoClick = (item, type) => {
    setShowSug(false)
    if (type === 'album') {
      navigate('/album/' + item.id)
    } else if (type === 'song') {
      navigate('/album/' + item.album.id)
    } else if (type === 'artist') {
      navigate('/artist/' + item.id)
    }
    const recentlySearched = JSON.parse(localStorage.getItem('recentlySearched') || '[]')
    recentlySearched.unshift({ ...item, type })
    localStorage.setItem('recentlySearched', JSON.stringify(recentlySearched))
  }

  const searchRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = e => {
      if (!searchRef.current?.contains(e.target)) {
        setShowSug(false)
      }
    }

    document.addEventListener('pointerdown', handleClickOutside)
    return () => document.removeEventListener('pointerdown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={searchRef}>
      <input
        className="w-full border-2"
        onFocus={handleFocus}
        onKeyDown={handleKeydown}
        placeholder="搜索"
        type="text"
        value={searchText}
        onChange={handleChange}
        // onBlur={() => setShowSug(false)}
      />
      {showSug && (
        <div className="absolute top-full left-0 w-full bg-white border max-h-[calc(100vh-3rem)] overflow-y-auto overscroll-contain">
          <div>
            {sugsKeyword?.map(sug => (
              <div key={sug.keyword} onClick={() => handleSugClick(sug.keyword)}>
                {sug.keyword}
              </div>
            ))}
          </div>
          <div>
            {sugsAl?.map(({ id, name, artist }) => {
              return (
                <div key={id} onClick={() => handleSugAlSoClick({ id, name, artist }, 'album')}>
                  <div>{name}</div>
                  <div>专辑 · {artist.name}</div>
                </div>
              )
            })}
          </div>
          <div>
            {sugsSo?.map(({ id, name, artists = [], album: { id: albumId } = {} }) => (
              <div
                key={id}
                onClick={() =>
                  handleSugAlSoClick({ id, name, artists, album: { id: albumId } }, 'song')
                }>
                <div>{name}</div>
                <div>歌曲 · {artists.map(a => a.name).join('/')}</div>
              </div>
            ))}
          </div>
          <div>
            {sugsAr?.map(({ id, name }) => (
              <div key={id} onClick={() => handleSugAlSoClick({ id, name }, 'artist')}>
                <div>{name}</div>
                <div>Artist</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Search
