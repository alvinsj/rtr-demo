
import { test, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from './App'

test('runs vitest', () => {
  expect(1).toBe(1)
})

test('renders text', () => {
  const wrapper = render(<App />)
  expect(wrapper).toBeTruthy()

  const { getByText } = wrapper
  expect(getByText('Login')).toBeTruthy()
})
