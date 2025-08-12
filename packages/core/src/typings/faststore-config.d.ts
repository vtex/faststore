declare module 'discovery-config' {
  export interface FaststoreConfig {
    seo: {
      title: string
      description: string
      titleTemplate: string
      author: string
      name: string
      publisherId: string
      plp: {
        titleTemplate: string
        descriptionTemplate: string
      }
      pdp: {
        titleTemplate: string
        descriptionTemplate: string
      }
      search: {
        titleTemplate: string
        descriptionTemplate: string
        noIndex: boolean
        noFollow: boolean
        bodyH1: string
      }
    }

    // Theming
    theme: string

    // Ecommerce Platform
    platform: string

    // Platform specific configs for API
    api: {
      storeId: string
      workspace: string
      subDomainPrefix: Array<string>
      environment: string
      hideUnavailableItems: boolean
      showSponsored: boolean
      incrementAddress: boolean
      enableUnavailableItemsOnCart: boolean
    }

    // Default session
    session: {
      currency: {
        code: string
        symbol: string
      }
      locale: string
      channel: string
      country: string
      deliveryMode: null
      addressType: null
      city: null
      postalCode: null
      geoCoordinates: null
      b2b: null
      person: null
      marketingData: {
        utmCampaign: string
        utmMedium: string
        utmSource: string
        utmiCampaign: string
        utmiPart: string
        utmiPage: string
      }
      refreshAfter: null // timestamp in seconds e.g. '1743042990'
    }

    // Default cart
    cart: {
      id: string
      items: Array<unknown>
      messages: Array<unknown>
      shouldSplitItem: boolean
    }

    // Production URLs
    // secureSubdomain is the same as storeUrl because we are using single domain approach for this account
    storeUrl: string
    secureSubdomain: string
    checkoutUrl: string
    loginUrl: string
    accountUrl: string

    // Preview redirects
    previewRedirects: {
      home: string
      plp: string
      search: string
      pdp: string
      500: string
      404: string
    }

    // Lighthouse CI
    lighthouse: {
      server: string
      pages: {
        home: string
        pdp: string
        collection: string
      }
    }

    // E2E CI
    cypress: {
      pages: {
        home: string
        pdp: string
        collection: string
        collection_2: string
        collection_filtered: string
        search: string
      }
    }

    analytics: {
      gtmContainerId: string
    }

    cms: {
      data: string
    }

    contentSource: {
      type: string
    }

    deliveryPromise: {
      enabled: boolean
      mandatory: boolean
    }

    experimental: {
      cypressVersion: number
      enableCypressExtension: boolean
      noRobots: boolean
      noindex: boolean
      nofollow: boolean
      preact: boolean
      enableRedirects: boolean
      enableSearchSSR: boolean
      enableFaststoreMyAccount: boolean
      enableVtexAssetsLoader: boolean
      graphqlCacheControl: {
        maxAge: number // 0 disables cache, 5 * 60 enable cache control maxAge 5 minutes
        staleWhileRevalidate: number
      }
      refreshToken: boolean
    }
  }

  const config: FaststoreConfig;
  export default config
}
