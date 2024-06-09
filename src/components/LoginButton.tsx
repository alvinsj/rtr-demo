import useInitPKCE from '@/hooks/useInitPKCE'

const LoginButton = () => {
  const { error, onLogin } = useInitPKCE()

  return (
    <>
      <button type="submit" onClick={onLogin}>
        Login
      </button>
      <pre>
        {error}
      </pre>
      <pre>
        {document.cookie}
      </pre>
    </>
  )
}

export default LoginButton
