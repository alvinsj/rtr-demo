import { deleteRefreshToken } from "@/utils/token"
import { useCallback } from "react"

type LogoutButtonProps = {
  className?: string
}
const LogoutButton = ({ className }: LogoutButtonProps) => {
  const handleLogout = useCallback(() => {
    deleteRefreshToken()
    window.location.reload()
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
