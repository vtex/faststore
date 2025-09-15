# FastStore Font

Provides a consistent interface for adding both remote and local fonts.

## Usage

### Google Fonts

`GoogleFont` wraps all [google-fonts from nextjs](https://nextjs.org/docs/app/getting-started/fonts#google-fonts)

```ts
import { GoogleFont } from '@vtex/faststore-font'

const inter = GoogleFont.Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

function Page() {
  return (
    <div className={inter} />
  )
}
```

### Local fonts

`localFont` export [nextjs font/local](https://nextjs.org/docs/app/getting-started/fonts#local-fonts).

```ts
import { localFont } from '@vtex/faststore-font'

const grotesk = localFont({
  src: [{
    path: './path/to/file/VTEXGrotesk.woff2',
    weight: '400',
    display: 'swap',
    variable: '--font-vtex-grotesk',
  }],
})

function Page() {
  return (
    <div className={grotesk} />
  )
}
```
