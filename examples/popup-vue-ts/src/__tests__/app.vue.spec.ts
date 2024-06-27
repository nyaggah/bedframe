import { render, fireEvent, screen } from '@testing-library/vue'
import { describe, test } from 'vitest'

import App from '../App.vue'

describe('<App />', () => {
  test('increments value on click', async () => {
    render(App)

    // screen has all queries that you can use in your tests.
    // getByText returns the first matching node for the provided text, and
    // throws an error if no elements match or if more than one match is found.
    screen.getByText('count is 0')

    const button = screen.getByText('count is 0')

    // Dispatch a native click event to our button element.
    await fireEvent.click(button)
    await fireEvent.click(button)

    screen.getByText('count is 2')
  })
})
