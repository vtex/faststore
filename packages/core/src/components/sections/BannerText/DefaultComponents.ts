import dynamic from 'next/dynamic'

const UIBannerText = dynamic(() =>
  import(/* webpackChunkName: "UIBannerText" */ '@vtex/faststore-ui').then(
    (mod) => mod.BannerText
  )
)
const UIBannerTextContent = dynamic(() =>
  import(
    /* webpackChunkName: "UIBannerTextContent" */ '@vtex/faststore-ui'
  ).then((mod) => mod.BannerTextContent)
)

export const BannerTextDefaultComponents = {
  BannerText: UIBannerText,
  BannerTextContent: UIBannerTextContent,
} as const
