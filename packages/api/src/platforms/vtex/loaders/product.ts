import { isValidSkuId, pickBestSku } from '../utils/sku'
import { BadRequestError, NotFoundError } from '../../errors'
import { findChannel, findLocale, findSkuId, findSlug } from '../utils/facets'
import { mutateChannelContext, mutateLocaleContext } from '../utils/contex'
import { enhanceSku } from '../utils/enhanceSku'
import { IStoreSelectedFacet } from '../../..'
import { Context } from '..'

export const getProductLoader = async ( locator: IStoreSelectedFacet[], ctx: Context) => {
        // Insert channel in context for later usage
        const channel = findChannel(locator)
        const locale = findLocale(locator)
        const id = findSkuId(locator)
        const slug = findSlug(locator)
    
        if (channel) {
          mutateChannelContext(ctx, channel)
        }
    
        if (locale) {
          mutateLocaleContext(ctx, locale)
        }
    
        const {
          loaders: { skuLoader },
          clients: { commerce, search },
        } = ctx
    
        try {
          const skuId = id ?? slug?.split('-').pop() ?? ''
    
          if (!isValidSkuId(skuId)) {
            throw new Error('Invalid SkuId')
          }
    
          const sku = await skuLoader.load(skuId)
    
          /**
           * Here be dragons 🦄🦄🦄
           *
           * In some cases, the slug has a valid skuId for a different
           * product. This condition makes sure that the fetched sku
           * is the one we actually asked for
           * */
          if (
            slug &&
            sku.isVariantOf.linkText &&
            !slug.startsWith(sku.isVariantOf.linkText)
          ) {
            throw new Error(
              `Slug was set but the fetched sku does not satisfy the slug condition. slug: ${slug}, linkText: ${sku.isVariantOf.linkText}`
            )
          }

          console.log("SKU", JSON.stringify(sku, null, 2))
    
          return sku
        } catch (err) {
          if (slug == null) {
            throw new BadRequestError('Missing slug or id')
          }
    
          const route = await commerce.catalog.portal.pagetype(`${slug}/p`)
    
          if (route.pageType !== 'Product' || !route.id) {
            throw new NotFoundError(`No product found for slug ${slug}`)
          }
    
          const {
            products: [product],
          } = await search.products({
            page: 0,
            count: 1,
            query: `product:${route.id}`,
          })

          console.log("PRODUCT", product)
    
          if (!product) {
            throw new NotFoundError(`No product found for id ${route.id}`)
          }
    
          const sku = pickBestSku(product.items)
    
          return enhanceSku(sku, product)
        }
}