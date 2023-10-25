import { storeUrl } from '../../../faststore.config'

export default function handler(req, res) {
  res.send(
    `User-agent: *\nAllow: /\nDisallow: /checkout/*\nSitemap: ${storeUrl}/sitemap/sitemap-index.xml\nHost: ${storeUrl}`
  )
}
