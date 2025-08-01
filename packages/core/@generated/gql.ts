/* eslint-disable */
import * as types from './graphql'

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n  fragment ProductSummary_product on StoreProduct {\n    id: productID\n    slug\n    sku\n    brand {\n      brandName: name\n    }\n    name\n    gtin\n\t\tunitMultiplier\n\n    isVariantOf {\n      productGroupID\n      name\n\t\t\tskuVariants {\n\t\t\t\tallVariantsByName\n\t\t\t\tactiveVariations\n\t\t\t\tslugsMap\n\t\t\t\tavailableVariations\n\t\t\t}\n    }\n\n    image {\n      url\n      alternateName\n    }\n\n    brand {\n      name\n    }\n\n    offers {\n      lowPrice\n      lowPriceWithTaxes\n      offers {\n        availability\n        price\n        listPrice\n        listPriceWithTaxes\n\t\t\t\tpriceWithTaxes\n        quantity\n        seller {\n          identifier\n        }\n      }\n    }\n\n    additionalProperty {\n      propertyID\n      name\n      value\n      valueReference\n    }\n\n    advertisement {\n      adId\n      adResponseId\n    }\n  }\n':
    types.ProductSummary_ProductFragmentDoc,
  '\n  fragment Filter_facets on StoreFacet {\n    ... on StoreFacetRange {\n      key\n      label\n\n      min {\n        selected\n        absolute\n      }\n\n      max {\n        selected\n        absolute\n      }\n\n      __typename\n    }\n    ... on StoreFacetBoolean {\n      key\n      label\n      values {\n        label\n        value\n        selected\n        quantity\n      }\n\n      __typename\n    }\n  }\n':
    types.Filter_FacetsFragmentDoc,
  '\n  fragment ProductDetailsFragment_product on StoreProduct {\n    id: productID\n    sku\n    name\n    gtin\n    description\n    unitMultiplier\n    isVariantOf {\n      name\n      productGroupID\n\t\t\tskuVariants {\n        activeVariations\n        slugsMap\n        availableVariations\n      }\n    }\n\n    image {\n      url\n      alternateName\n    }\n\n    brand {\n      name\n    }\n\n    offers {\n      lowPrice\n      lowPriceWithTaxes\n      offers {\n        availability\n        price\n        priceWithTaxes\n        listPrice\n        listPriceWithTaxes\n        seller {\n          identifier\n        }\n      }\n    }\n\n    additionalProperty {\n      propertyID\n      name\n      value\n      valueReference\n    }\n\n    # Contains necessary info to add this item to cart\n    ...CartProductItem\n  }\n':
    types.ProductDetailsFragment_ProductFragmentDoc,
  '\n  fragment ProductSKUMatrixSidebarFragment_product on StoreProduct {\n    id: productID\n    isVariantOf {\n      name\n      productGroupID\n      skuVariants {\n        activeVariations\n        slugsMap\n        availableVariations\n        allVariantProducts {\n\t\t\t\t\tsku\n          name\n          image {\n            url\n            alternateName\n          }\n          offers {\n            highPrice\n            lowPrice\n            lowPriceWithTaxes\n            offerCount\n            priceCurrency\n            offers {\n              listPrice\n              listPriceWithTaxes\n              sellingPrice\n              priceCurrency\n              price\n              priceWithTaxes\n              priceValidUntil\n              itemCondition\n              availability\n              quantity\n            }\n          }\n          additionalProperty {\n            propertyID\n            value\n            name\n            valueReference\n          }\n        }\n      }\n    }\n  }\n':
    types.ProductSkuMatrixSidebarFragment_ProductFragmentDoc,
  '\n  fragment ClientManyProducts on Query {\n    search(\n      first: $first\n      after: $after\n      sort: $sort\n      term: $term\n      selectedFacets: $selectedFacets\n      sponsoredCount: $sponsoredCount\n\n    ) {\n      products {\n        pageInfo {\n          totalCount\n        }\n      }\n    }\n  }\n':
    types.ClientManyProductsFragmentDoc,
  '\n  fragment ClientProduct on Query {\n    product(locator: $locator) {\n      id: productID\n    }\n  }\n':
    types.ClientProductFragmentDoc,
  '\n  fragment ClientProductGallery on Query {\n    search(\n      first: $first\n      after: $after\n      sort: $sort\n      term: $term\n      selectedFacets: $selectedFacets\n    ) {\n      products {\n        pageInfo {\n          totalCount\n        }\n      }\n    }\n  }\n':
    types.ClientProductGalleryFragmentDoc,
  '\n  fragment ClientSearchSuggestions on Query {\n    search(first: 5, term: $term, selectedFacets: $selectedFacets) {\n      suggestions {\n        terms {\n          value\n        }\n      }\n    }\n  }\n':
    types.ClientSearchSuggestionsFragmentDoc,
  '\n  fragment ClientShippingSimulation on Query {\n    shipping(items: $items, postalCode: $postalCode, country: $country) {\n      address {\n        city\n      }\n    }\n  }\n':
    types.ClientShippingSimulationFragmentDoc,
  '\n  fragment ClientTopSearchSuggestions on Query {\n    search(first: 5, term: $term, selectedFacets: $selectedFacets) {\n      suggestions {\n        terms {\n          value\n        }\n      }\n    }\n  }\n':
    types.ClientTopSearchSuggestionsFragmentDoc,
  '\n  fragment ServerCollectionPage on Query {\n    collection(slug: $slug) {\n      id\n    }\n  }\n':
    types.ServerCollectionPageFragmentDoc,
  '\n  fragment ServerProduct on Query {\n    product(locator: $locator) {\n      id: productID\n    }\n  }\n':
    types.ServerProductFragmentDoc,
  '\n  query ServerAccountPageQuery {\n    accountName\n  }\n':
    types.ServerAccountPageQueryDocument,
  '\n  query ServerCollectionPageQuery($slug: String!) {\n    ...ServerCollectionPage\n    collection(slug: $slug) {\n      seo {\n        title\n        description\n      }\n      breadcrumbList {\n        itemListElement {\n          item\n          name\n          position\n        }\n      }\n      meta {\n        selectedFacets {\n          key\n          value\n        }\n      }\n    }\n  }\n':
    types.ServerCollectionPageQueryDocument,
  '\n  query ServerProductQuery($locator: [IStoreSelectedFacet!]!) {\n    ...ServerProduct\n    product(locator: $locator) {\n      id: productID\n\n      seo {\n        title\n        description\n        canonical\n      }\n\n      brand {\n        name\n      }\n\n      sku\n      gtin\n      name\n      description\n      releaseDate\n\n      breadcrumbList {\n        itemListElement {\n          item\n          name\n          position\n        }\n      }\n\n      image {\n        url\n        alternateName\n      }\n\n      offers {\n        lowPrice\n        highPrice\n        lowPriceWithTaxes\n        priceCurrency\n        offers {\n          availability\n          price\n          priceValidUntil\n          priceCurrency\n          itemCondition\n          seller {\n            identifier\n          }\n        }\n      }\n\n      isVariantOf {\n        productGroupID\n      }\n\n      ...ProductDetailsFragment_product\n    }\n  }\n':
    types.ServerProductQueryDocument,
  '\n  fragment UserOrderItemsFragment on UserOrderItems {\n    id\n    name\n    quantity\n    sellingPrice\n    unitMultiplier\n    measurementUnit\n    imageUrl\n    detailUrl\n    refId\n    rewardValue\n  }\n':
    types.UserOrderItemsFragmentFragmentDoc,
  '\n  query ServerOrderDetailsQuery($orderId: String!) {\n    userOrder(orderId: $orderId) {\n      orderId\n      status\n      canProcessOrderAuthorization\n      statusDescription\n      allowCancellation\n      ruleForAuthorization {\n        orderAuthorizationId\n        dimensionId\n        rule {\n          id\n          name\n          status\n          doId\n          authorizedEmails\n          priority\n          trigger {\n            condition {\n              conditionType\n              description\n              lessThan\n              greatherThan\n              expression\n            }\n            effect {\n              description\n              effectType\n              funcPath\n            }\n          }\n          timeout\n          notification\n          scoreInterval {\n            accept\n            deny\n          }\n          authorizationData {\n            requireAllApprovals\n            authorizers {\n              id\n              email\n              type\n              authorizationDate\n            }\n          }\n          isUserAuthorized\n          isUserNextAuthorizer\n        }\n      }\n      storePreferencesData {\n        currencyCode\n      }\n      clientProfileData {\n        firstName\n        lastName\n        email\n        phone\n        corporateName\n        isCorporate\n      }\n      customFields {\n        type\n        id\n        fields {\n          name\n          value\n          refId\n        }\n      }\n      deliveryOptionsData {\n        deliveryOptions {\n          selectedSla\n          deliveryChannel\n          deliveryCompany\n          deliveryWindow {\n            startDateUtc\n            endDateUtc\n            price\n          }\n          shippingEstimate\n          shippingEstimateDate\n          friendlyShippingEstimate\n          friendlyDeliveryOptionName\n          seller\n          address {\n            addressType\n            receiverName\n            addressId\n            versionId\n            entityId\n            postalCode\n            city\n            state\n            country\n            street\n            number\n            neighborhood\n            complement\n            reference\n            geoCoordinates\n          }\n          pickupStoreInfo {\n            additionalInfo\n            address {\n              addressType\n              receiverName\n              addressId\n              versionId\n              entityId\n              postalCode\n              city\n              state\n              country\n              street\n              number\n              neighborhood\n              complement\n              reference\n              geoCoordinates\n            }\n            dockId\n            friendlyName\n            isPickupStore\n          }\n          quantityOfDifferentItems\n          total\n          items {\n            id\n            uniqueId\n            name\n            quantity\n            price\n            imageUrl\n            tax\n            total\n          }\n        }\n        contact {\n          email\n          phone\n          name\n        }\n      }\n      paymentData {\n        transactions {\n          isActive\n          payments {\n            id\n            paymentSystemName\n            value\n            installments\n            referenceValue\n            lastDigits\n            url\n            group\n            tid\n            connectorResponses {\n              authId\n            }\n            bankIssuedInvoiceIdentificationNumber\n            redemptionCode\n            paymentOrigin\n          }\n        }\n      }\n      totals {\n        id\n        name\n        value\n      }\n      shopperName {\n        firstName\n        lastName\n      }\n    }\n    accountName\n  }\n':
    types.ServerOrderDetailsQueryDocument,
  '\n  query ServerListOrdersQuery ($page: Int,$perPage: Int, $status: [String], $dateInitial: String, $dateFinal: String, $text: String, $clientEmail: String) {\n    listUserOrders (page: $page, perPage: $perPage, status: $status, dateInitial: $dateInitial, dateFinal: $dateFinal, text: $text, clientEmail: $clientEmail) {\n      list {\n        orderId\n        creationDate\n        clientName\n        items {\n          seller\n          quantity\n          description\n          ean\n          refId\n          id\n          productId\n          sellingPrice\n          price\n        }\n        totalValue\n        status\n        statusDescription\n        ShippingEstimatedDate\n        currencyCode\n        customFields {\n          type\n          value\n        }\n      }\n      paging {\n        total\n        pages\n        currentPage\n        perPage\n      }\n    }\n    accountName\n  }\n':
    types.ServerListOrdersQueryDocument,
  '\n  query ServerProfileQuery {\n    accountName\n    accountProfile {\n      name\n      email\n      id\n    }\n  }\n':
    types.ServerProfileQueryDocument,
  '\n  query ServerSecurityQuery {\n    accountName\n  }\n':
    types.ServerSecurityQueryDocument,
  '\n  query ServerUserDetailsQuery {\n    accountName\n    userDetails {\n      name\n      email\n      role\n      orgUnit\n    }\n  }\n':
    types.ServerUserDetailsQueryDocument,
  '\n  mutation CancelOrderMutation($data: IUserOrderCancel!) {\n    cancelOrder(data: $data) {\n      data\n    }\n  }\n':
    types.CancelOrderMutationDocument,
  '\n  mutation ProcessOrderAuthorizationMutation($data: IProcessOrderAuthorization!) {\n    processOrderAuthorization(data: $data) {\n      isPendingForOtherAuthorizer\n      ruleForAuthorization {\n        orderAuthorizationId\n        dimensionId\n        rule {\n          id\n          name\n          status\n          doId\n          authorizedEmails\n          priority\n          trigger {\n            condition {\n              conditionType\n              description\n              lessThan\n              greatherThan\n              expression\n            }\n            effect {\n              description\n              effectType\n              funcPath\n            }\n          }\n          timeout\n          notification\n          scoreInterval {\n            accept\n            deny\n          }\n          authorizationData {\n            requireAllApprovals\n            authorizers {\n              id\n              email\n              type\n              authorizationDate\n            }\n          }\n          isUserAuthorized\n          isUserNextAuthorizer\n        }\n      }\n    }\n  }\n':
    types.ProcessOrderAuthorizationMutationDocument,
  '\n  query ValidateUser {\n    validateUser {\n      isValid\n    }\n  }\n':
    types.ValidateUserDocument,
  '\n  mutation ValidateCartMutation($cart: IStoreCart!, $session: IStoreSession!) {\n    validateCart(cart: $cart, session: $session) {\n      order {\n        orderNumber\n        acceptedOffer {\n          ...CartItem\n        }\n        shouldSplitItem\n      }\n      messages {\n        ...CartMessage\n      }\n    }\n  }\n\n  fragment CartMessage on StoreCartMessage {\n    text\n    status\n  }\n\n  fragment CartItem on StoreOffer {\n    seller {\n      identifier\n    }\n    quantity\n    price\n    priceWithTaxes\n    listPrice\n    listPriceWithTaxes\n    itemOffered {\n      ...CartProductItem\n    }\n  }\n\n  fragment CartProductItem on StoreProduct {\n    sku\n    name\n    unitMultiplier\n    image {\n      url\n      alternateName\n    }\n    brand {\n      name\n    }\n    isVariantOf {\n      productGroupID\n      name\n      skuVariants {\n        activeVariations\n        slugsMap\n        availableVariations\n      }\n    }\n    gtin\n    additionalProperty {\n      propertyID\n      name\n      value\n      valueReference\n    }\n  }\n':
    types.ValidateCartMutationDocument,
  '\n  query ClientPickupPointsQuery(\n    $geoCoordinates: IStoreGeoCoordinates\n  ) {\n    pickupPoints(geoCoordinates: $geoCoordinates) {\n      pickupPointDistances {\n        pickupId\n        distance\n        pickupName\n        isActive\n        address {\n          city\n          state\n          number\n          postalCode\n          street\n        }\n      }\n    }\n  }\n':
    types.ClientPickupPointsQueryDocument,
  '\n  mutation SubscribeToNewsletter($data: IPersonNewsletter!) {\n    subscribeToNewsletter(data: $data) {\n      id\n    }\n  }\n':
    types.SubscribeToNewsletterDocument,
  '\n  query ClientProductCountQuery($term: String) {\n    productCount(term: $term) {\n      total\n    }\n  }\n':
    types.ClientProductCountQueryDocument,
  '\n  query ClientAllVariantProductsQuery($locator: [IStoreSelectedFacet!]!) {\n      product(locator: $locator) {\n      ...ProductSKUMatrixSidebarFragment_product\n    }\n  }\n':
    types.ClientAllVariantProductsQueryDocument,
  '\n  query ClientManyProductsQuery(\n    $first: Int!\n    $after: String\n    $sort: StoreSort!\n    $term: String!\n    $selectedFacets: [IStoreSelectedFacet!]!\n    $sponsoredCount: Int\n  ) {\n    ...ClientManyProducts\n    search(\n      first: $first\n      after: $after\n      sort: $sort\n      term: $term\n      selectedFacets: $selectedFacets\n      sponsoredCount: $sponsoredCount\n    ) {\n      products {\n        pageInfo {\n          totalCount\n        }\n        edges {\n          node {\n            ...ProductSummary_product\n          }\n        }\n      }\n    }\n  }\n':
    types.ClientManyProductsQueryDocument,
  '\n  query ClientProductGalleryQuery(\n    $first: Int!\n    $after: String!\n    $sort: StoreSort!\n    $term: String!\n    $selectedFacets: [IStoreSelectedFacet!]!\n  ) {\n    ...ClientProductGallery\n    redirect(term: $term, selectedFacets: $selectedFacets) {\n      url\n    }\n    search(\n      first: $first\n      after: $after\n      sort: $sort\n      term: $term\n      selectedFacets: $selectedFacets\n    ) {\n      products {\n        pageInfo {\n          totalCount\n        }\n      }\n      facets {\n        ...Filter_facets\n      }\n      metadata {\n        ...SearchEvent_metadata\n      }\n    }\n  }\n\n  fragment SearchEvent_metadata on SearchMetadata {\n    isTermMisspelled\n    logicalOperator\n    fuzzy\n  }\n':
    types.ClientProductGalleryQueryDocument,
  '\n  query ClientProductQuery($locator: [IStoreSelectedFacet!]!) {\n    ...ClientProduct\n    product(locator: $locator) {\n      ...ProductDetailsFragment_product\n    }\n  }\n':
    types.ClientProductQueryDocument,
  '\n  query ClientProfileQuery($id: String!) {\n    profile(id: $id) {\n      addresses {\n        country\n        postalCode\n        geoCoordinate\n        city\n      }\n    }\n  }\n':
    types.ClientProfileQueryDocument,
  '\n  query ClientSearchSuggestionsQuery(\n    $term: String!\n    $selectedFacets: [IStoreSelectedFacet!]\n  ) {\n    ...ClientSearchSuggestions\n    search(first: 5, term: $term, selectedFacets: $selectedFacets) {\n      suggestions {\n        terms {\n          value\n        }\n        products {\n          ...ProductSummary_product\n        }\n      }\n      products {\n        pageInfo {\n          totalCount\n        }\n      }\n      metadata {\n        ...SearchEvent_metadata\n      }\n    }\n  }\n':
    types.ClientSearchSuggestionsQueryDocument,
  '\n  query ClientTopSearchSuggestionsQuery(\n    $term: String!\n    $selectedFacets: [IStoreSelectedFacet!]\n  ) {\n    ...ClientTopSearchSuggestions\n    search(first: 5, term: $term, selectedFacets: $selectedFacets) {\n      suggestions {\n        terms {\n          value\n        }\n      }\n    }\n  }\n':
    types.ClientTopSearchSuggestionsQueryDocument,
  '\n  mutation ValidateSession($session: IStoreSession!, $search: String!) {\n    validateSession(session: $session, search: $search) {\n      locale\n      channel\n      country\n      addressType\n      postalCode\n      city\n      deliveryMode {\n        deliveryChannel\n        deliveryMethod\n        deliveryWindow {\n          startDate\n          endDate\n        }\n      }\n      geoCoordinates {\n        latitude\n        longitude\n      }\n      currency {\n        code\n        symbol\n      }\n      person {\n        id\n        email\n        givenName\n        familyName\n      }\n      b2b {\n        customerId\n        isRepresentative\n        unitName\n        unitId\n        firstName\n        lastName\n        userName\n        userEmail\n        savedPostalCode\n      }\n      marketingData {\n        utmCampaign\n        utmMedium\n        utmSource\n        utmiCampaign\n        utmiPage\n        utmiPart\n      }\n    }\n  }\n':
    types.ValidateSessionDocument,
  '\n  query ClientShippingSimulationQuery(\n    $postalCode: String!\n    $country: String!\n    $items: [IShippingItem!]!\n  ) {\n    ...ClientShippingSimulation\n    shipping(items: $items, postalCode: $postalCode, country: $country) {\n      logisticsInfo {\n        slas {\n          carrier\n          price\n          availableDeliveryWindows {\n            startDateUtc\n            endDateUtc\n            price\n            listPrice\n          }\n          shippingEstimate\n          localizedEstimates\n          deliveryChannel\n        }\n      }\n      address {\n        city\n        neighborhood\n        state\n      }\n    }\n  }\n':
    types.ClientShippingSimulationQueryDocument,
  '\n  query ServerManyProductsQuery(\n    $first: Int!\n    $after: String\n    $sort: StoreSort!\n    $term: String!\n    $selectedFacets: [IStoreSelectedFacet!]!\n    $sponsoredCount: Int\n  ) {\n    ...ClientManyProducts\n    search(\n      first: $first\n      after: $after\n      sort: $sort\n      term: $term\n      selectedFacets: $selectedFacets\n      sponsoredCount: $sponsoredCount\n    ) {\n      products {\n        pageInfo {\n          totalCount\n        }\n        edges {\n          node {\n            ...ProductSummary_product\n          }\n        }\n      }\n      metadata {\n        ...SearchEvent_metadata\n      }\n    }\n  }\n':
    types.ServerManyProductsQueryDocument,
}

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment ProductSummary_product on StoreProduct {\n    id: productID\n    slug\n    sku\n    brand {\n      brandName: name\n    }\n    name\n    gtin\n\t\tunitMultiplier\n\n    isVariantOf {\n      productGroupID\n      name\n\t\t\tskuVariants {\n\t\t\t\tallVariantsByName\n\t\t\t\tactiveVariations\n\t\t\t\tslugsMap\n\t\t\t\tavailableVariations\n\t\t\t}\n    }\n\n    image {\n      url\n      alternateName\n    }\n\n    brand {\n      name\n    }\n\n    offers {\n      lowPrice\n      lowPriceWithTaxes\n      offers {\n        availability\n        price\n        listPrice\n        listPriceWithTaxes\n\t\t\t\tpriceWithTaxes\n        quantity\n        seller {\n          identifier\n        }\n      }\n    }\n\n    additionalProperty {\n      propertyID\n      name\n      value\n      valueReference\n    }\n\n    advertisement {\n      adId\n      adResponseId\n    }\n  }\n'
): typeof import('./graphql').ProductSummary_ProductFragmentDoc
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment Filter_facets on StoreFacet {\n    ... on StoreFacetRange {\n      key\n      label\n\n      min {\n        selected\n        absolute\n      }\n\n      max {\n        selected\n        absolute\n      }\n\n      __typename\n    }\n    ... on StoreFacetBoolean {\n      key\n      label\n      values {\n        label\n        value\n        selected\n        quantity\n      }\n\n      __typename\n    }\n  }\n'
): typeof import('./graphql').Filter_FacetsFragmentDoc
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment ProductDetailsFragment_product on StoreProduct {\n    id: productID\n    sku\n    name\n    gtin\n    description\n    unitMultiplier\n    isVariantOf {\n      name\n      productGroupID\n\t\t\tskuVariants {\n        activeVariations\n        slugsMap\n        availableVariations\n      }\n    }\n\n    image {\n      url\n      alternateName\n    }\n\n    brand {\n      name\n    }\n\n    offers {\n      lowPrice\n      lowPriceWithTaxes\n      offers {\n        availability\n        price\n        priceWithTaxes\n        listPrice\n        listPriceWithTaxes\n        seller {\n          identifier\n        }\n      }\n    }\n\n    additionalProperty {\n      propertyID\n      name\n      value\n      valueReference\n    }\n\n    # Contains necessary info to add this item to cart\n    ...CartProductItem\n  }\n'
): typeof import('./graphql').ProductDetailsFragment_ProductFragmentDoc
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment ProductSKUMatrixSidebarFragment_product on StoreProduct {\n    id: productID\n    isVariantOf {\n      name\n      productGroupID\n      skuVariants {\n        activeVariations\n        slugsMap\n        availableVariations\n        allVariantProducts {\n\t\t\t\t\tsku\n          name\n          image {\n            url\n            alternateName\n          }\n          offers {\n            highPrice\n            lowPrice\n            lowPriceWithTaxes\n            offerCount\n            priceCurrency\n            offers {\n              listPrice\n              listPriceWithTaxes\n              sellingPrice\n              priceCurrency\n              price\n              priceWithTaxes\n              priceValidUntil\n              itemCondition\n              availability\n              quantity\n            }\n          }\n          additionalProperty {\n            propertyID\n            value\n            name\n            valueReference\n          }\n        }\n      }\n    }\n  }\n'
): typeof import('./graphql').ProductSkuMatrixSidebarFragment_ProductFragmentDoc
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment ClientManyProducts on Query {\n    search(\n      first: $first\n      after: $after\n      sort: $sort\n      term: $term\n      selectedFacets: $selectedFacets\n      sponsoredCount: $sponsoredCount\n\n    ) {\n      products {\n        pageInfo {\n          totalCount\n        }\n      }\n    }\n  }\n'
): typeof import('./graphql').ClientManyProductsFragmentDoc
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment ClientProduct on Query {\n    product(locator: $locator) {\n      id: productID\n    }\n  }\n'
): typeof import('./graphql').ClientProductFragmentDoc
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment ClientProductGallery on Query {\n    search(\n      first: $first\n      after: $after\n      sort: $sort\n      term: $term\n      selectedFacets: $selectedFacets\n    ) {\n      products {\n        pageInfo {\n          totalCount\n        }\n      }\n    }\n  }\n'
): typeof import('./graphql').ClientProductGalleryFragmentDoc
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment ClientSearchSuggestions on Query {\n    search(first: 5, term: $term, selectedFacets: $selectedFacets) {\n      suggestions {\n        terms {\n          value\n        }\n      }\n    }\n  }\n'
): typeof import('./graphql').ClientSearchSuggestionsFragmentDoc
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment ClientShippingSimulation on Query {\n    shipping(items: $items, postalCode: $postalCode, country: $country) {\n      address {\n        city\n      }\n    }\n  }\n'
): typeof import('./graphql').ClientShippingSimulationFragmentDoc
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment ClientTopSearchSuggestions on Query {\n    search(first: 5, term: $term, selectedFacets: $selectedFacets) {\n      suggestions {\n        terms {\n          value\n        }\n      }\n    }\n  }\n'
): typeof import('./graphql').ClientTopSearchSuggestionsFragmentDoc
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment ServerCollectionPage on Query {\n    collection(slug: $slug) {\n      id\n    }\n  }\n'
): typeof import('./graphql').ServerCollectionPageFragmentDoc
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment ServerProduct on Query {\n    product(locator: $locator) {\n      id: productID\n    }\n  }\n'
): typeof import('./graphql').ServerProductFragmentDoc
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ServerAccountPageQuery {\n    accountName\n  }\n'
): typeof import('./graphql').ServerAccountPageQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ServerCollectionPageQuery($slug: String!) {\n    ...ServerCollectionPage\n    collection(slug: $slug) {\n      seo {\n        title\n        description\n      }\n      breadcrumbList {\n        itemListElement {\n          item\n          name\n          position\n        }\n      }\n      meta {\n        selectedFacets {\n          key\n          value\n        }\n      }\n    }\n  }\n'
): typeof import('./graphql').ServerCollectionPageQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ServerProductQuery($locator: [IStoreSelectedFacet!]!) {\n    ...ServerProduct\n    product(locator: $locator) {\n      id: productID\n\n      seo {\n        title\n        description\n        canonical\n      }\n\n      brand {\n        name\n      }\n\n      sku\n      gtin\n      name\n      description\n      releaseDate\n\n      breadcrumbList {\n        itemListElement {\n          item\n          name\n          position\n        }\n      }\n\n      image {\n        url\n        alternateName\n      }\n\n      offers {\n        lowPrice\n        highPrice\n        lowPriceWithTaxes\n        priceCurrency\n        offers {\n          availability\n          price\n          priceValidUntil\n          priceCurrency\n          itemCondition\n          seller {\n            identifier\n          }\n        }\n      }\n\n      isVariantOf {\n        productGroupID\n      }\n\n      ...ProductDetailsFragment_product\n    }\n  }\n'
): typeof import('./graphql').ServerProductQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  fragment UserOrderItemsFragment on UserOrderItems {\n    id\n    name\n    quantity\n    sellingPrice\n    unitMultiplier\n    measurementUnit\n    imageUrl\n    detailUrl\n    refId\n    rewardValue\n  }\n'
): typeof import('./graphql').UserOrderItemsFragmentFragmentDoc
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ServerOrderDetailsQuery($orderId: String!) {\n    userOrder(orderId: $orderId) {\n      orderId\n      status\n      canProcessOrderAuthorization\n      statusDescription\n      allowCancellation\n      ruleForAuthorization {\n        orderAuthorizationId\n        dimensionId\n        rule {\n          id\n          name\n          status\n          doId\n          authorizedEmails\n          priority\n          trigger {\n            condition {\n              conditionType\n              description\n              lessThan\n              greatherThan\n              expression\n            }\n            effect {\n              description\n              effectType\n              funcPath\n            }\n          }\n          timeout\n          notification\n          scoreInterval {\n            accept\n            deny\n          }\n          authorizationData {\n            requireAllApprovals\n            authorizers {\n              id\n              email\n              type\n              authorizationDate\n            }\n          }\n          isUserAuthorized\n          isUserNextAuthorizer\n        }\n      }\n      storePreferencesData {\n        currencyCode\n      }\n      clientProfileData {\n        firstName\n        lastName\n        email\n        phone\n        corporateName\n        isCorporate\n      }\n      customFields {\n        type\n        id\n        fields {\n          name\n          value\n          refId\n        }\n      }\n      deliveryOptionsData {\n        deliveryOptions {\n          selectedSla\n          deliveryChannel\n          deliveryCompany\n          deliveryWindow {\n            startDateUtc\n            endDateUtc\n            price\n          }\n          shippingEstimate\n          shippingEstimateDate\n          friendlyShippingEstimate\n          friendlyDeliveryOptionName\n          seller\n          address {\n            addressType\n            receiverName\n            addressId\n            versionId\n            entityId\n            postalCode\n            city\n            state\n            country\n            street\n            number\n            neighborhood\n            complement\n            reference\n            geoCoordinates\n          }\n          pickupStoreInfo {\n            additionalInfo\n            address {\n              addressType\n              receiverName\n              addressId\n              versionId\n              entityId\n              postalCode\n              city\n              state\n              country\n              street\n              number\n              neighborhood\n              complement\n              reference\n              geoCoordinates\n            }\n            dockId\n            friendlyName\n            isPickupStore\n          }\n          quantityOfDifferentItems\n          total\n          items {\n            id\n            uniqueId\n            name\n            quantity\n            price\n            imageUrl\n            tax\n            total\n          }\n        }\n        contact {\n          email\n          phone\n          name\n        }\n      }\n      paymentData {\n        transactions {\n          isActive\n          payments {\n            id\n            paymentSystemName\n            value\n            installments\n            referenceValue\n            lastDigits\n            url\n            group\n            tid\n            connectorResponses {\n              authId\n            }\n            bankIssuedInvoiceIdentificationNumber\n            redemptionCode\n            paymentOrigin\n          }\n        }\n      }\n      totals {\n        id\n        name\n        value\n      }\n      shopperName {\n        firstName\n        lastName\n      }\n    }\n    accountName\n  }\n'
): typeof import('./graphql').ServerOrderDetailsQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ServerListOrdersQuery ($page: Int,$perPage: Int, $status: [String], $dateInitial: String, $dateFinal: String, $text: String, $clientEmail: String) {\n    listUserOrders (page: $page, perPage: $perPage, status: $status, dateInitial: $dateInitial, dateFinal: $dateFinal, text: $text, clientEmail: $clientEmail) {\n      list {\n        orderId\n        creationDate\n        clientName\n        items {\n          seller\n          quantity\n          description\n          ean\n          refId\n          id\n          productId\n          sellingPrice\n          price\n        }\n        totalValue\n        status\n        statusDescription\n        ShippingEstimatedDate\n        currencyCode\n        customFields {\n          type\n          value\n        }\n      }\n      paging {\n        total\n        pages\n        currentPage\n        perPage\n      }\n    }\n    accountName\n  }\n'
): typeof import('./graphql').ServerListOrdersQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ServerProfileQuery {\n    accountName\n    accountProfile {\n      name\n      email\n      id\n    }\n  }\n'
): typeof import('./graphql').ServerProfileQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ServerSecurityQuery {\n    accountName\n  }\n'
): typeof import('./graphql').ServerSecurityQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ServerUserDetailsQuery {\n    accountName\n    userDetails {\n      name\n      email\n      role\n      orgUnit\n    }\n  }\n'
): typeof import('./graphql').ServerUserDetailsQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation CancelOrderMutation($data: IUserOrderCancel!) {\n    cancelOrder(data: $data) {\n      data\n    }\n  }\n'
): typeof import('./graphql').CancelOrderMutationDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation ProcessOrderAuthorizationMutation($data: IProcessOrderAuthorization!) {\n    processOrderAuthorization(data: $data) {\n      isPendingForOtherAuthorizer\n      ruleForAuthorization {\n        orderAuthorizationId\n        dimensionId\n        rule {\n          id\n          name\n          status\n          doId\n          authorizedEmails\n          priority\n          trigger {\n            condition {\n              conditionType\n              description\n              lessThan\n              greatherThan\n              expression\n            }\n            effect {\n              description\n              effectType\n              funcPath\n            }\n          }\n          timeout\n          notification\n          scoreInterval {\n            accept\n            deny\n          }\n          authorizationData {\n            requireAllApprovals\n            authorizers {\n              id\n              email\n              type\n              authorizationDate\n            }\n          }\n          isUserAuthorized\n          isUserNextAuthorizer\n        }\n      }\n    }\n  }\n'
): typeof import('./graphql').ProcessOrderAuthorizationMutationDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ValidateUser {\n    validateUser {\n      isValid\n    }\n  }\n'
): typeof import('./graphql').ValidateUserDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation ValidateCartMutation($cart: IStoreCart!, $session: IStoreSession!) {\n    validateCart(cart: $cart, session: $session) {\n      order {\n        orderNumber\n        acceptedOffer {\n          ...CartItem\n        }\n        shouldSplitItem\n      }\n      messages {\n        ...CartMessage\n      }\n    }\n  }\n\n  fragment CartMessage on StoreCartMessage {\n    text\n    status\n  }\n\n  fragment CartItem on StoreOffer {\n    seller {\n      identifier\n    }\n    quantity\n    price\n    priceWithTaxes\n    listPrice\n    listPriceWithTaxes\n    itemOffered {\n      ...CartProductItem\n    }\n  }\n\n  fragment CartProductItem on StoreProduct {\n    sku\n    name\n    unitMultiplier\n    image {\n      url\n      alternateName\n    }\n    brand {\n      name\n    }\n    isVariantOf {\n      productGroupID\n      name\n      skuVariants {\n        activeVariations\n        slugsMap\n        availableVariations\n      }\n    }\n    gtin\n    additionalProperty {\n      propertyID\n      name\n      value\n      valueReference\n    }\n  }\n'
): typeof import('./graphql').ValidateCartMutationDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ClientPickupPointsQuery(\n    $geoCoordinates: IStoreGeoCoordinates\n  ) {\n    pickupPoints(geoCoordinates: $geoCoordinates) {\n      pickupPointDistances {\n        pickupId\n        distance\n        pickupName\n        isActive\n        address {\n          city\n          state\n          number\n          postalCode\n          street\n        }\n      }\n    }\n  }\n'
): typeof import('./graphql').ClientPickupPointsQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation SubscribeToNewsletter($data: IPersonNewsletter!) {\n    subscribeToNewsletter(data: $data) {\n      id\n    }\n  }\n'
): typeof import('./graphql').SubscribeToNewsletterDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ClientProductCountQuery($term: String) {\n    productCount(term: $term) {\n      total\n    }\n  }\n'
): typeof import('./graphql').ClientProductCountQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ClientAllVariantProductsQuery($locator: [IStoreSelectedFacet!]!) {\n      product(locator: $locator) {\n      ...ProductSKUMatrixSidebarFragment_product\n    }\n  }\n'
): typeof import('./graphql').ClientAllVariantProductsQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ClientManyProductsQuery(\n    $first: Int!\n    $after: String\n    $sort: StoreSort!\n    $term: String!\n    $selectedFacets: [IStoreSelectedFacet!]!\n    $sponsoredCount: Int\n  ) {\n    ...ClientManyProducts\n    search(\n      first: $first\n      after: $after\n      sort: $sort\n      term: $term\n      selectedFacets: $selectedFacets\n      sponsoredCount: $sponsoredCount\n    ) {\n      products {\n        pageInfo {\n          totalCount\n        }\n        edges {\n          node {\n            ...ProductSummary_product\n          }\n        }\n      }\n    }\n  }\n'
): typeof import('./graphql').ClientManyProductsQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ClientProductGalleryQuery(\n    $first: Int!\n    $after: String!\n    $sort: StoreSort!\n    $term: String!\n    $selectedFacets: [IStoreSelectedFacet!]!\n  ) {\n    ...ClientProductGallery\n    redirect(term: $term, selectedFacets: $selectedFacets) {\n      url\n    }\n    search(\n      first: $first\n      after: $after\n      sort: $sort\n      term: $term\n      selectedFacets: $selectedFacets\n    ) {\n      products {\n        pageInfo {\n          totalCount\n        }\n      }\n      facets {\n        ...Filter_facets\n      }\n      metadata {\n        ...SearchEvent_metadata\n      }\n    }\n  }\n\n  fragment SearchEvent_metadata on SearchMetadata {\n    isTermMisspelled\n    logicalOperator\n    fuzzy\n  }\n'
): typeof import('./graphql').ClientProductGalleryQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ClientProductQuery($locator: [IStoreSelectedFacet!]!) {\n    ...ClientProduct\n    product(locator: $locator) {\n      ...ProductDetailsFragment_product\n    }\n  }\n'
): typeof import('./graphql').ClientProductQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ClientProfileQuery($id: String!) {\n    profile(id: $id) {\n      addresses {\n        country\n        postalCode\n        geoCoordinate\n        city\n      }\n    }\n  }\n'
): typeof import('./graphql').ClientProfileQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ClientSearchSuggestionsQuery(\n    $term: String!\n    $selectedFacets: [IStoreSelectedFacet!]\n  ) {\n    ...ClientSearchSuggestions\n    search(first: 5, term: $term, selectedFacets: $selectedFacets) {\n      suggestions {\n        terms {\n          value\n        }\n        products {\n          ...ProductSummary_product\n        }\n      }\n      products {\n        pageInfo {\n          totalCount\n        }\n      }\n      metadata {\n        ...SearchEvent_metadata\n      }\n    }\n  }\n'
): typeof import('./graphql').ClientSearchSuggestionsQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ClientTopSearchSuggestionsQuery(\n    $term: String!\n    $selectedFacets: [IStoreSelectedFacet!]\n  ) {\n    ...ClientTopSearchSuggestions\n    search(first: 5, term: $term, selectedFacets: $selectedFacets) {\n      suggestions {\n        terms {\n          value\n        }\n      }\n    }\n  }\n'
): typeof import('./graphql').ClientTopSearchSuggestionsQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  mutation ValidateSession($session: IStoreSession!, $search: String!) {\n    validateSession(session: $session, search: $search) {\n      locale\n      channel\n      country\n      addressType\n      postalCode\n      city\n      deliveryMode {\n        deliveryChannel\n        deliveryMethod\n        deliveryWindow {\n          startDate\n          endDate\n        }\n      }\n      geoCoordinates {\n        latitude\n        longitude\n      }\n      currency {\n        code\n        symbol\n      }\n      person {\n        id\n        email\n        givenName\n        familyName\n      }\n      b2b {\n        customerId\n        isRepresentative\n        unitName\n        unitId\n        firstName\n        lastName\n        userName\n        userEmail\n        savedPostalCode\n      }\n      marketingData {\n        utmCampaign\n        utmMedium\n        utmSource\n        utmiCampaign\n        utmiPage\n        utmiPart\n      }\n    }\n  }\n'
): typeof import('./graphql').ValidateSessionDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ClientShippingSimulationQuery(\n    $postalCode: String!\n    $country: String!\n    $items: [IShippingItem!]!\n  ) {\n    ...ClientShippingSimulation\n    shipping(items: $items, postalCode: $postalCode, country: $country) {\n      logisticsInfo {\n        slas {\n          carrier\n          price\n          availableDeliveryWindows {\n            startDateUtc\n            endDateUtc\n            price\n            listPrice\n          }\n          shippingEstimate\n          localizedEstimates\n          deliveryChannel\n        }\n      }\n      address {\n        city\n        neighborhood\n        state\n      }\n    }\n  }\n'
): typeof import('./graphql').ClientShippingSimulationQueryDocument
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: '\n  query ServerManyProductsQuery(\n    $first: Int!\n    $after: String\n    $sort: StoreSort!\n    $term: String!\n    $selectedFacets: [IStoreSelectedFacet!]!\n    $sponsoredCount: Int\n  ) {\n    ...ClientManyProducts\n    search(\n      first: $first\n      after: $after\n      sort: $sort\n      term: $term\n      selectedFacets: $selectedFacets\n      sponsoredCount: $sponsoredCount\n    ) {\n      products {\n        pageInfo {\n          totalCount\n        }\n        edges {\n          node {\n            ...ProductSummary_product\n          }\n        }\n      }\n      metadata {\n        ...SearchEvent_metadata\n      }\n    }\n  }\n'
): typeof import('./graphql').ServerManyProductsQueryDocument

export function gql(source: string) {
  return (documents as any)[source] ?? {}
}
