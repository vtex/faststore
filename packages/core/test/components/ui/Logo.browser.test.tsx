import { render } from '@testing-library/react'

import Logo from 'src/components/ui/Logo/Logo'

const imageSpy = vi.fn()

vi.mock('src/components/ui/Image', () => ({
  Image: (props: Record<string, unknown>) => {
    imageSpy(props)
    return <div data-testid="logo-image" />
  },
}))

describe('Logo', () => {
  beforeEach(() => {
    imageSpy.mockClear()
  })

  it('uses eager loading by default', () => {
    render(<Logo alt="FastStore" src="/logo.svg" />)

    expect(imageSpy).toHaveBeenCalledTimes(1)
    expect(imageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        loading: 'eager',
      })
    )
  })

  it('keeps explicit loading overrides', () => {
    render(<Logo alt="FastStore" src="/logo.svg" loading="lazy" />)

    expect(imageSpy).toHaveBeenCalledTimes(1)
    expect(imageSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        loading: 'lazy',
      })
    )
  })
})
