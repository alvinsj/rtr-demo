import useInitPKCE from '@/hooks/useInitPKCE'

type LoginButtonProps = {
  className?: string
}
const LoginButton = ({ className }: LoginButtonProps) => {
  const { error, onLogin } = useInitPKCE()

  return (
    <div className={className}>
      <span>{error}</span>
      <span>
        <button type="submit" onClick={onLogin}>
          Login
        </button>
      </span>
    </div>
  )
}

export default LoginButton
