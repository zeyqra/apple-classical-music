import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import request from './request1'
import { request as req } from './request'
import { createOptimisticMutation } from './helper'
import { useLoginStatus } from './user'
import useUserStore from '../stores/user'
export const getAlbumNew = ({ area = 'ALL', offset = 0, limit = 10 }) => {
  return request.get('/album/new', { params: { area, offset, limit } })
}
export const getAlbum = ({ id }) => {
  return request.get('/album', { params: { id } })
}
export const getSongUrlV1 = ({ id, level }) => {
  return request.get('/song/url/v1', { params: { id, level } })
}

export const getAlbumSublist = params => {
  return request.get('/album/sublist', { params })
}

export const albumDetailDynamic = params => {
  return request.get('/album/detail/dynamic', { params })
}

export const albumSub = data => {
  return request.post('/album/sub', data)
}

export const like = data => {
  return request.post('/like', data)
}

// export const songLikeCheck = params => {
//   return request.get('/song/like/check', { params })
// }

export const likeList = params => {
  return request.get('/likelist', { params })
}

export const userPlaylistCreate = params => {
  return request.get('/user/playlist/create', { params })
}
export const playlistTrackAll = params => {
  return request.get('/playlist/track/all', { params })
}

export const search = params => {
  return request.get('/search', { params })
}

export const banner = () => {
  return request.get('/banner')
}
export const recommendSongs = () => {
  return request.get('/recommend/songs')
}
export const albumNewest = () => {
  return request.get('/album/newest')
}
export const toplist = () => {
  return request.get('/toplist')
}
export const recordRecentAlbum = params => {
  return request.get('/record/recent/album', { params })
}
export const lyric = params => {
  return request.get('/lyric', { params })
}
export const playlistDetail = params => {
  return request.get('/playlist/detail', { params })
}
export const searchSuggest = params => {
  return request.get('/search/suggest', { params })
}
export const searchHot = () => {
  return request.get('/search/hot')
}

// ===========================================

export const useAlbumNew = ({ limit, infinite, area }) =>
  useInfiniteQuery({
    queryKey: ['albumNew', infinite ? 'infinite' : 'normal'],
    queryFn: ({ pageParam = 0 }) => getAlbumNew({ limit, offset: pageParam, area }),
    getNextPageParam: (lastPage, allPages) => {
      // console.log('console: lastPage', lastPage)
      // console.log('console: allPages', allPages)
      return lastPage.total > allPages.length * limit ? allPages.length * limit : undefined
    },
  })

export const useAlbum = params =>
  useQuery({
    queryKey: ['album', params],
    queryFn: () => getAlbum(params),
  })

export const useSongUrlV1 = params =>
  useQuery({
    queryKey: ['songUrlV1', params],
    queryFn: () => getSongUrlV1(params),
    enabled: !!params.id,
    staleTime: Infinity,
  })

export const useAlbumSublist = ({ limit } = {}) =>
  useInfiniteQuery({
    queryKey: ['albumSublist'],
    queryFn: ({ pageParam = 0 }) => getAlbumSublist({ limit, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length * limit : undefined
    },
    staleTime: 60 * 1000 * 5, // 5分钟
  })

export const useAlbumDetailDynamic = params =>
  useQuery({
    queryKey: ['albumDetailDynamic', params],
    queryFn: () => albumDetailDynamic(params),
  })

export const useAlbumSub = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: albumSub,
    onMutate: async ({ id, t }) => {
      const queryKey = ['albumDetailDynamic', { id }]
      await queryClient.cancelQueries(queryKey)
      const previousData = queryClient.getQueryData(queryKey)

      queryClient.setQueryData(queryKey, oldData => ({
        ...oldData,
        isSub: t === 1,
      }))

      return { previousData, queryKey }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(context.queryKey, context.previousData)
    },
    onSuccess: (data, vars, context) => {
      queryClient.invalidateQueries({ queryKey: ['albumSublist'] })
    },
  })
}

// export const useSongLikeMap = ids =>
//   useQuery({
//     queryKey: ['songLikeMap'],
//     queryFn: async () => {
//       const res = await songLikeCheck({ ids: JSON.stringify(ids) })
//       const likedIds = res.ids || []
//       const likedSet = new Set(likedIds)
//       return Object.fromEntries(ids.map(id => [id, likedSet.has(id)]))
//     },
//   })

export const useLikeList = params =>
  useQuery({
    queryKey: ['likeList'],
    queryFn: async () => {
      const res = await likeList(params)
      const likedIds = res.ids || []
      return new Set(likedIds)
    },
  })

export const useLike = () => {
  const queryClient = useQueryClient()
  const { data: loginStatus } = useLoginStatus()
  const uid = loginStatus?.data.account.id
  return useMutation({
    mutationFn: vars => like({ ...vars, uid }),
    onMutate: async ({ id, like, playlistId }) => {
      // const likeListKey = ['likeList', { uid }]
      const likeListKey = ['likeList']
      await queryClient.cancelQueries(likeListKey)
      const likeListPrevious = queryClient.getQueryData(likeListKey)
      // console.log('console: likeList:', likeListPrevious)
      queryClient.setQueryData(likeListKey, oldData => {
        const newData = new Set(oldData)
        like ? newData.add(id) : newData.delete(id)
        return newData
      })

      const favouritesId = queryClient.getQueryData(['userPlaylistCreate', { uid }])?.pages[0]?.data
        ?.playlist[0]?.id

      queryClient.invalidateQueries({
        queryKey: ['playlistTrackAll', favouritesId],
        exact: true,
      })
      // if (!playlistTrackAllPrevious) {
      return { likeListPrevious, likeListKey }
      // }

      // queryClient.setQueryData(favouritesTrackAllKey, oldData => {
      //   console.log('console: oldData', oldData)
      //   if (!like) {
      //     return {
      //       ...oldData,
      //       pages: oldData.pages.map(page => ({
      //         ...page,
      //         songs: page.songs.filter(song => song.id !== id),
      //       })),
      //     }
      //   } else {
      //     return {
      //       ...oldData,
      //       pages: oldData.pages.map((page, index) => {
      //         if (index === 0) {
      //           return {
      //             ...page,
      //             songs: [{ id, name: 'Unknown', ar: [], al: {} }, ...page.songs],
      //           }
      //         } else {
      //           return page
      //         }
      //       }),
      //     }
      //   }
      // })
      // return { likeListPrevious, likeListKey, playlistTrackAllPrevious, favouritesTrackAllKey }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(context.likeListKey, context.likeListPrevious)
      context.favouritesTrackAllKey &&
        queryClient.setQueryData(context.favouritesTrackAllKey, context.playlistTrackAllPrevious)
    },
    // onSuccess: (data, vars, context) => {
    //   queryClient.invalidateQueries({ queryKey: ['albumSublist'] })
    // },
  })
}

export const useUserPlaylistCreate = params => {
  const { data: loginStatus } = useLoginStatus()
  const uid = loginStatus?.data.account.id
  return useInfiniteQuery({
    queryKey: ['userPlaylistCreate', { uid }],
    queryFn: ({ pageParam = 0 }) => userPlaylistCreate({ ...params, uid, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.more ? allPages.length * params.limit : undefined,
    enabled: !!uid,
  })
}

export const usePlaylistTrackAll = ({ id, offset, limit, total }) =>
  useInfiniteQuery({
    queryKey: ['playlistTrackAll', id],
    queryFn: ({ pageParam = 0 }) => playlistTrackAll({ id, limit, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) =>
      total > allPages.length * limit ? allPages.length * limit : undefined,
    staleTime: 60 * 1000 * 5, // 5分钟
    enabled: !!id,
  })

export const useSearch = ({ keywords, type, limit, offset }) =>
  useInfiniteQuery({
    queryKey: ['search', { keywords, type }],
    queryFn: ({ pageParam = 0 }) => search({ keywords, type, limit, offset: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const countKey =
        type === 1
          ? 'songCount'
          : type === 10
            ? 'albumCount'
            : type === 100
              ? 'artistCount'
              : type === 1000
                ? 'playlistCount'
                : type === 1002
                  ? 'userprofileCount'
                  : undefined
      return lastPage.result[countKey] > allPages.length * limit
        ? allPages.length * limit
        : undefined
    },

    enabled: !!keywords,
  })

export const useBanner = () =>
  useQuery({
    queryKey: ['banner'],
    queryFn: () => banner(),
  })
const cookie = useUserStore.getState().cookie
export const useRecommendSongs = () =>
  useQuery({
    queryKey: ['recommendSongs'],
    queryFn: () => recommendSongs(),
    enabled: !!cookie,
  })
export const useAlbumNewest = () =>
  useQuery({
    queryKey: ['albumNewest'],
    queryFn: () => albumNewest(),
  })
export const useToplist = () =>
  useQuery({
    queryKey: ['toplist'],
    queryFn: () => toplist(),
  })

export const useRecordRecentAlbum = ({ limit, infinite }) =>
  useInfiniteQuery({
    queryKey: ['recordRecentAlbum', infinite ? 'infinite' : 'normal'],
    queryFn: ({ pageParam = limit }) => recordRecentAlbum({ limit: pageParam }),
    getNextPageParam: (_, pages) => (pages.length + 1) * limit,
  })

export const useLyric = ({ id }) =>
  useQuery({
    queryKey: ['lyric', { id }],
    queryFn: () => lyric({ id }),
    enabled: !!id,
  })
export const usePlaylistDetail = ({ id }) =>
  useQuery({
    queryKey: ['playlistDetail', { id }],
    queryFn: () => playlistDetail({ id }),
    enabled: !!id,
  })
export const useSearchSuggest = ({ keywords, type, show }) =>
  useQuery({
    queryKey: ['searchSuggest', { keywords, type }],
    queryFn: () => searchSuggest({ keywords, type }),
    enabled: !!(keywords && show),
  })
export const useSearchHot = () =>
  useQuery({
    queryKey: ['searchHot'],
    queryFn: () => searchHot(),
  })

export const userPlaylistCreate2 = (params, options) => {
  return req('/user/playlist/create' + '?uid=1645212553', {
    params,
    ...options,
  })
}

export const albums = (params, options) => {
  return req('/albums', {
    params,
    ...options,
  })
}

export const album = (params, options) => {
  return req(`/albums/${params.id}`, {
    params,
    ...options,
  })
}

// export const media = (params, options) => {
//   return req(`/media/${params.id}.flac`, {
//     params,
//     ...options,
//   })
// }
