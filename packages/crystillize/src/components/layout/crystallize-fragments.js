import { graphql } from "gatsby"

/**
 * Enrich all components from here with shared Crystallize GraphQL fragments.
 * Very useful when doing GraphQL calls down the line
 */
export const query = graphql`
  fragment crystallize_image on CRYSTALLIZE_Image {
    url
    altText
    variants {
      url
      width
    }
  }
  fragment crystallize_video on CRYSTALLIZE_Video {
    title
    playlists
    thumbnails {
      key
      url
      variants {
        url
        width
      }
    }
  }
  fragment crystallize_imageContent on CRYSTALLIZE_ImageContent {
    images {
      ...crystallize_image
    }
  }
  fragment crystallize_videoContent on CRYSTALLIZE_VideoContent {
    videos {
      ...crystallize_video
    }
  }
  fragment crystallize_singleLineContent on CRYSTALLIZE_SingleLineContent {
    text
  }

  fragment crystallize_richTextContent on CRYSTALLIZE_RichTextContent {
    json
  }

  fragment crystallize_paragraphCollectionContent on CRYSTALLIZE_ParagraphCollectionContent {
    paragraphs {
      title {
        ...crystallize_singleLineContent
      }
      body {
        ...crystallize_richTextContent
      }
      images {
        ...crystallize_image
      }
      videos {
        ...crystallize_video
      }
    }
  }

  fragment crystallize_item on CRYSTALLIZE_Item {
    id
    name
    type
    path
    topics {
      name
      children {
        name
      }
      parent {
        name
      }
    }
    components {
      name
      type
      meta {
        key
        value
      }
      content {
        ...crystallize_singleLineContent
        ...crystallize_richTextContent
        ...crystallize_imageContent
        ...crystallize_videoContent
        ...crystallize_paragraphCollectionContent
      }
    }
  }

  fragment crystallize_product on CRYSTALLIZE_Product {
    id
    vatType {
      name
      percent
    }
    isVirtual
    isSubscriptionOnly
    variants {
      id
      name
      sku
      price
      stock
      isDefault
      attributes {
        attribute
        value
      }
      image {
        url
        altText
        variants {
          url
          width
        }
      }
      subscriptionPlans {
        id
        name
        initialPeriod
        initialPrice
        recurringPeriod
        recurringPrice
      }
    }
  }
`
