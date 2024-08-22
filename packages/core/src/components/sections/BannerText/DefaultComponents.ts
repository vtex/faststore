import dynamic from 'next/dynamic'

const UIBannerText = dynamic(() =>
  import(/* webpackChunkName: "UIBannerText" */ '@faststore/ui').then(
    (mod) => mod.BannerText
  )
)
const UIBannerTextContent = dynamic(() =>
  import(/* webpackChunkName: "UIBannerTextContent" */ '@faststore/ui').then(
    (mod) => mod.BannerTextContent
  )
)

export const BannerTextDefaultComponents = {
  BannerText: UIBannerText,
  BannerTextContent: UIBannerTextContent,
} as const
