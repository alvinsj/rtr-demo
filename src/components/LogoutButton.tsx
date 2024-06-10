import { deleteRefreshToken } from "@/utils/refreshToken"
import { useCallback } from "react"

import { reload } from '@/utils/route'

type LogoutButtonProps = {
  className?: string
}
const LogoutButton = ({ className }: LogoutButtonProps) => {
  const handleLogout = useCallback(() => {
    deleteRefreshToken()
    reload()
  }, [])

  return (
    <div className={className}>
      <span>
        <button type="submit" onClick={handleLogout}>
          Logout
        </button>
      </span>
    </div>
  )
}

export default LogoutButton
