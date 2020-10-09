import React, { FC } from 'react'
import { Helmet } from 'react-helmet'

import { useCurrency } from '../../../sdk/localization/useCurrency'
import { ProductPageProps } from '../../../templates/product'
import { useStructuredProduct } from './useStructuredProduct'
import SiteMetadataSEO from '../../HomePage/SEO'
import { isServer } from '../../../utils/env'

// eslint-disable-next-line prefer-regex-literals
const botPattern = new RegExp(
  '(googlebot/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)',
  'i'
)

const isBot = () => botPattern.test(navigator.userAgent)

const SEO: FC<ProductPageProps> = (props) => {
  const {
    data: {
      vtex: { product },
    },
  } = props

  const [currency] = useCurrency()
  const structuredProduct = useStructuredProduct(product!, currency)

  if (isServer) {
    return null
  }

  // eslint-disable-next-line no-console
  console.log({
    status: 'Running SEO',
    isBot: isBot(),
  })

  return (
    <>
      <SiteMetadataSEO {...props} />
      {structuredProduct != null && (
        <Helmet
          script={[
            {
              type: 'application/ld+json',
              innerHTML: JSON.stringify(structuredProduct),
            },
          ]}
        />
      )}
    </>
  )
}

export default SEO
