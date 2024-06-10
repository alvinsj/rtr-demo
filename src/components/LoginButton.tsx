import useInitPKCE from '@/hooks/useInitPKCE'

type LoginButtonProps = {
  className?: string
}
const LoginButton = ({ className }: LoginButtonProps) => {
  const { error, onLogin } = useInitPKCE()

  return (
    <div className={className}>
      <span className='error'>{error}</span>
      <button type="submit" onClick={onLogin}>
        Login
      </button>
    </div>
  )
}

export default LoginButton
