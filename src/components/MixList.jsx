import { useEffect, useState } from 'react'
import api from '../api'
import Menu from './Menu'

const MixList = () => {
  const [mixList, setMixList] = useState([])

  const fetchMixList = async () => {
    setMixList(await api.mixlist())
  }

  useEffect(() => {
    fetchMixList()
  }, [])

  const handleMenuSuccess = ({ action, target }) => {
    if (action === 'library') {
      setMixList(pre =>
        pre.map(item => {
          if (item.type === target.type && target.id === item.id) {
            item.isInLibrary = !item.isInLibrary
          }
        })
      )
    } else if (action === 'favourite') {
      setMixList(pre =>
        pre.map(item => {
          if (item.type === target.type && target.id === item.id) {
            return {
              ...item,
              isFavourite: !item.isFavourite,
            }
          }
          return item
        })
      )
    }
  }
  return (
    <div>
      {mixList.map(item => (
        <div key={item.id + '-' + item.type}>
          <span>{item.title}</span>
          <Menu hasPlay={true} targetType={item.type} target={item} onSuccess={handleMenuSuccess} />
        </div>
      ))}
    </div>
  )
}

export default MixList
