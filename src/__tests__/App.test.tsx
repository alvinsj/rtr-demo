
import { test, expect, describe } from 'vitest'
import { render } from '@testing-library/react'
import App from '../App'

test('runs vitest', () => {
  expect(1).toBe(1)
})

describe('App', () => {
  test('renders with snapshot', () => {
    const screen = render(<App />)
    expect(screen.container.children[0]).toMatchSnapshot()
  })
})




