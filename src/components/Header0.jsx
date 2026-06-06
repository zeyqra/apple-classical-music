import { useUser } from '../hooks/useAuth'
import { logout } from '../utils/auth.js'
import { useConfirm } from '@/hooks/useConfirm'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const Header = () => {
  const { data: user } = useUser()
  // 登出
  const confirm = useConfirm()
  // const getAvatarFallback = (username = '') => {
  //   const value = username.trim()
  //   if (!value) return ''
  //   const firstChar = value[0]
  //   if (/^[\u4e00-\u9fa5]$/.test(firstChar)) {
  //     return firstChar
  //   }
  //   const englishChars = value.match(/[A-Za-z]/g) || []
  //   return englishChars.slice(0, 2).join('').toUpperCase() || firstChar
  // }

  const handleLogout = async () => {
    const result = await confirm()
    if (result) logout()
  }
  return (
    <div
      className="header 
      flex items-center justify-between">
      <h1 className="font-semibold">Reminders</h1>
      {/* 用户名 / 登出 */}
      <div>
        {user && (
          // <>
          //   {/* <Button variant="outline">
          //     <span>{user.username}</span>
          //   </Button> */}
          //   <span>{user.username}</span>
          //   <button onClick={handleLogout}>登出</button>
          // </>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                {/* <Button variant="ghost" size="icon" className="rounded-full"> */}
                {/* <Avatar>
                 <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
                  <AvatarFallback>{getAvatarFallback(user.username)}</AvatarFallback>
                </Avatar> */}
                {user.username}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              <DropdownMenuGroup>
                {/* <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup> */}
                <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}

export default Header
