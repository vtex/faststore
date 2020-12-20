import { gql } from '@vtex/gatsby-plugin-graphql'
import PQueue from 'p-queue'

export { addToCart } from './addToCart'
export { getOrderForm } from './getOrderForm'
export { updateItems } from './updateItems'

const ORDER_FORM_STORAGE_KEY = 'vtex:orderFormId'

// Queue to make changes to the orderForm.
// There should be only one single instance of this queue in the whole app
const singletonQueue = () => {
  const pqueue = new PQueue({
    concurrency: 1,
  })

  // This queue will be unpaused once we have an orderForm
  pqueue.pause()

  return () => pqueue
}

export const queue = singletonQueue()

export const getOrderformId = () => localStorage.getItem(ORDER_FORM_STORAGE_KEY)

export const setOrderFormId = (ofId: string) =>
  localStorage.setItem(ORDER_FORM_STORAGE_KEY, ofId)

export const clearOrderFormId = () =>
  localStorage.removeItem(ORDER_FORM_STORAGE_KEY)

export const fragment = gql`
  fragment OrderFormFragment_orderForm on VTEX_OrderForm {
    id
    items {
      additionalInfo {
        brandName
      }
      attachments {
        name
        content
      }
      attachmentOfferings {
        name
        required
        schema
      }
      bundleItems {
        additionalInfo {
          brandName
        }
        attachments {
          name
          content
        }
        attachmentOfferings {
          name
          required
          schema
        }
        availability
        detailUrl
        id
        imageUrls {
          at1x
          at2x
          at3x
        }
        listPrice
        measurementUnit
        name
        offerings {
          id
          name
          price
          type
          attachmentOfferings {
            name
            required
            schema
          }
        }
        price
        productCategories
        productCategoryIds
        productRefId
        productId
        quantity
        seller
        sellingPrice
        skuName
        skuSpecifications {
          fieldName
          fieldValues
        }
        unitMultiplier
        uniqueId
        refId
      }
      parentAssemblyBinding
      sellingPriceWithAssemblies
      options {
        assemblyId
        id
        quantity
        seller
        inputValues
        options {
          assemblyId
          id
          quantity
          seller
          inputValues
          options {
            assemblyId
            id
            quantity
            seller
            inputValues
          }
        }
      }
      availability
      detailUrl
      id
      imageUrls {
        at1x
        at2x
        at3x
      }
      listPrice
      manualPrice
      measurementUnit
      name
      offerings {
        id
        name
        price
        type
        attachmentOfferings {
          name
          required
          schema
        }
      }
      price
      productCategories
      productCategoryIds
      productRefId
      productId
      quantity
      seller
      sellingPrice
      skuName
      skuSpecifications {
        fieldName
        fieldValues
      }
      unitMultiplier
      uniqueId
      refId
    }
    canEditData
    loggedIn
    userProfileId
    userType
    marketingData {
      coupon
      utmCampaign
      utmMedium
      utmSource
      utmiCampaign
      utmiPart
      utmiPage
    }
    totalizers {
      id
      name
      value
    }
    shipping {
      countries
      availableAddresses {
        addressId
        addressType
        city
        complement
        country
        neighborhood
        number
        postalCode
        receiverName
        reference
        state
        street
        isDisposable
      }
      selectedAddress {
        addressId
        addressType
        city
        complement
        country
        neighborhood
        number
        postalCode
        receiverName
        reference
        state
        street
        isDisposable
      }
      deliveryOptions {
        id
        price
        estimate
        isSelected
      }
      isValid
    }
    paymentData {
      paymentSystems {
        id
        name
        groupName
        validator {
          regex
          mask
          cardCodeRegex
          cardCodeMask
          weights
          useCvv
          useExpirationDate
          useCardHolderName
          useBillingAddress
        }
        stringId
        requiresDocument
        isCustom
        description
        requiresAuthentication
        dueDate
      }
      payments {
        paymentSystem
        bin
        accountId
        tokenId
        installments
        referenceValue
        value
      }
      installmentOptions {
        paymentSystem
        installments {
          count
          hasInterestRate
          interestRate
          value
          total
        }
      }
      availableAccounts {
        accountId
        paymentSystem
        paymentSystemName
        cardNumber
        bin
      }
      isValid
    }
    clientProfileData {
      email
      firstName
      lastName
      document
      documentType
      phone
      isValid
    }
    clientPreferencesData {
      locale
      optInNewsletter
    }
    messages {
      couponMessages {
        code
      }
      generalMessages {
        code
        text
        status
      }
    }
    value
    allowManualPrice
  }
`
