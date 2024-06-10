
import { test, expect, vi, describe, Mock } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'

import LoginButton from '../LoginButton'
import config from '@/config'

const mocks = vi.hoisted(() => {
  return {
    useContextSelector: vi.fn(),
    deleteRefreshToken: vi.fn(),
    setAccessToken: vi.fn()
  }
})
vi.mock('use-context-selector', async (importOriginal) => {
  const actual = await importOriginal()
  return ({
    ...(actual as Record<string, unknown>),
    useContextSelector: mocks.useContextSelector
  })
})
vi.mock('@/utils/refreshToken', async (importOriginal) => {
  const actual = await importOriginal()
  return ({
    ...(actual as Record<string, unknown>),
    deleteRefreshToken: mocks.deleteRefreshToken
  })
})

describe('LoginButton', () => {
  test('renders with snapshot', () => {
    mocks.useContextSelector.mockReturnValue(null)

    const screen = render(<LoginButton />)
    expect(screen.container.children[0]).toMatchSnapshot()
  })

  test('logs in and redirects to login url', async () => {
    mocks.useContextSelector.mockReturnValue(null)
    vi.spyOn(location, 'replace')

    const { getByText } = render(<LoginButton />)
    fireEvent.click(getByText(/Login/))

    await vi.waitFor(() => {
      expect(location.replace).toHaveBeenCalled()

      const urlString = (location.replace as Mock).mock.calls[0][0]
      const url = new URL(urlString)
      expect(url.origin + url.pathname).toBe(config.LOGIN_URL)
    })
  })

  test('logs out and clears tokens', async () => {
    mocks.useContextSelector.mockReturnValueOnce('access_token_jwt')
    mocks.useContextSelector.mockReturnValueOnce(mocks.setAccessToken)

    const { getByText } = render(<LoginButton />)
    expect(getByText(/Logout/))

    fireEvent.click(getByText(/Logout/))
    expect(mocks.deleteRefreshToken).toHaveBeenCalledWith()
    expect(mocks.setAccessToken).toHaveBeenCalledWith(null)
  })

  test('shows loading state', async () => {
    mocks.useContextSelector.mockReturnValue(null)

    const { getByText } = render(<LoginButton />)
    expect(getByText(/Login/))

    act(() => {
      const event = new Event('beforeunload', {
        bubbles: true,
        cancelable: true,
      })
      window.dispatchEvent(event)
    })

    expect(getByText(/Loading/))
  })
})




