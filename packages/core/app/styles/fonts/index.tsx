import { Inter } from 'next/font/google'

const customFont = Inter({
  display: 'swap',
  variable: '--fs-font-inter',
  weight: ['400', '500', '600', '700', '900'],
  subsets: ['latin'], // Either define subsets or set preload to false https://nextjs.org/docs/messages/google-fonts-missing-subsets
})

export default customFont
