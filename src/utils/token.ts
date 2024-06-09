export const setRefreshToken = (refreshToken: string) => {
  // FIXME use secure storage or encryption
  localStorage.setItem(`refresh_token`, refreshToken)
}

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token')
}

