
import { render } from '@testing-library/react';
import App from './App';

it('runs vitest', () => {
  expect(1).toBe(1);
});

it('renders text', () => {
  const wrapper = render(<App />);
  expect(wrapper).toBeTruthy();

  const { getByText } = wrapper;
  expect(getByText('Vite + React')).toBeTruthy();
});
