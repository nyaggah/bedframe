import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { fireEvent, getByText } from '@testing-library/react'
import App from './App'

describe('<App />', () => {
  test('App mounts properly', () => {
    const wrapper = render(<App />)
    expect(wrapper).toBeTruthy()

    // Get by h1
    const templateName = wrapper.container.querySelector('h1')
    console.log('templateName?.textContent:', templateName?.innerHTML)
    expect(templateName?.textContent).toBe('bruh what is up?!')

    // Get by text using the React testing library
    const text = screen.getByText(/Config \/ Using/i)
    expect(text.textContent).toBeTruthy()
  })
})

describe.skip('User Events', () => {
  it('Click the button', () => {
    const wrapper = render(<App />)
    const button = wrapper.container.querySelector(
      'button'
    ) as HTMLButtonElement

    // button mounts with count in 0
    expect(button.textContent).toBe('count is 0')

    fireEvent(
      getByText(button, 'count is 0'),
      new MouseEvent('click', {
        bubbles: true,
      })
    )

    // The count hook is working
    expect(button.textContent).toBe('count is 1')
  })
})
