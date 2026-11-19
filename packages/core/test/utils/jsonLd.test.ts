import { describe, expect, it } from 'vitest'
import { serializeJsonLd } from '../../src/utils/jsonLd'

describe('serializeJsonLd', () => {
  it('serializes plain data as JSON', () => {
    const data = { '@type': 'WebSite', name: 'Store', url: 'https://a.b/' }

    expect(JSON.parse(serializeJsonLd(data))).toEqual(data)
  })

  it('escapes characters that could close the script tag', () => {
    const name = '</script><script>alert(1)</script><!--'
    const output = serializeJsonLd({ name })

    expect(output).not.toMatch(/[<>]/)
    expect(output).not.toContain('</script')
    expect(JSON.parse(output)).toEqual({ name })
  })

  it('keeps ampersands and line separators readable after parsing', () => {
    const name = 'Tom & Jerry\u2028Store'
    const output = serializeJsonLd({ name })

    expect(output).not.toContain('&')
    expect(output).not.toContain('\u2028')
    expect(JSON.parse(output)).toEqual({ name })
  })
})
