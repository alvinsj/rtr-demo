import useInitPKCE from '@/hooks/useInitPKCE'

type LoginButtonProps = {
  className?: string
}
const LoginButton = ({ className }: LoginButtonProps) => {
  const { error, onLogin } = useInitPKCE()

  return (
    <div className={className}>
      <button type="submit" onClick={onLogin}>
        Login
      </button>
      <pre>
        {error}
      </pre>
      <pre>
        {document.cookie}
      </pre>
    </div>
  )
}

export default LoginButton
