export interface ItemId {
  item_id: string
}

export interface ItemName {
  item_name: string
}

export type ItemUniqueIdentifier = ItemId | ItemName

export interface ItemWithoutIdentifier {
  /**
   * TODO: add description
   *
   * @type {string}
   * @memberof Item
   */
  affiliation?: string
  /**
   * TODO: add description
   *
   * @type {string}
   * @memberof Item
   */
  coupon?: string
  /**
   * TODO: add description
   *
   * @type {CurrencyCode}
   * @memberof Item
   */
  currency?: CurrencyCode
  /**
   * TODO: add description
   *
   * @type {number}
   * @memberof Item
   */
  discount?: number
  /**
   * TODO: add description
   *
   * @type {number}
   * @memberof Item
   */
  index?: number
  /**
   * TODO: add description
   *
   * @type {string}
   * @memberof Item
   */
  item_brand?: string
  /**
   * TODO: add description
   *
   * @type {string}
   * @memberof Item
   */
  item_category?: string
  /**
   * TODO: add description
   *
   * @type {string}
   * @memberof Item
   */
  item_category2?: string
  /**
   * TODO: add description
   *
   * @type {string}
   * @memberof Item
   */
  item_category3?: string
  /**
   * TODO: add description
   *
   * @type {string}
   * @memberof Item
   */
  item_category4?: string
  /**
   * TODO: add description
   *
   * @type {string}
   * @memberof Item
   */
  item_category5?: string
  /**
   * TODO: add description
   *
   * @type {string}
   * @memberof Item
   */
  item_list_id?: string
  /**
   * TODO: add description
   *
   * @type {string}
   * @memberof Item
   */
  item_list_name?: string
  /**
   * TODO: add description
   *
   * @type {string}
   * @memberof Item
   */
  item_variant?: string
  /**
   * TODO: add description
   *
   * @type {string}
   * @memberof Item
   */
  location_id?: string
  /**
   * TODO: add description
   *
   * @type {number}
   * @memberof Item
   */
  price?: number
  /**
   * TODO: add description
   *
   * @type {number}
   * @memberof Item
   */
  quantity?: number
}

export type Item = ItemUniqueIdentifier & ItemWithoutIdentifier

export interface PromotionParams {
  creative_name?: string
  creative_slot?: string
  location_id?: string
  promotion_id?: string
  promotion_name?: string
}

export type PromotionItem = Item & PromotionParams

/**
 * The values for this type were taken from https://github.com/freeall/currency-codes/blob/master/iso-4217-list-one.xml
 */
export type CurrencyCode =
  | 'AFN'
  | 'EUR'
  | 'ALL'
  | 'DZD'
  | 'USD'
  | 'EUR'
  | 'AOA'
  | 'XCD'
  | 'XCD'
  | 'ARS'
  | 'AMD'
  | 'AWG'
  | 'AUD'
  | 'EUR'
  | 'AZN'
  | 'BSD'
  | 'BHD'
  | 'BDT'
  | 'BBD'
  | 'BYN'
  | 'EUR'
  | 'BZD'
  | 'XOF'
  | 'BMD'
  | 'INR'
  | 'BTN'
  | 'BOB'
  | 'BOV'
  | 'USD'
  | 'BAM'
  | 'BWP'
  | 'NOK'
  | 'BRL'
  | 'USD'
  | 'BND'
  | 'BGN'
  | 'XOF'
  | 'BIF'
  | 'CVE'
  | 'KHR'
  | 'XAF'
  | 'CAD'
  | 'KYD'
  | 'XAF'
  | 'XAF'
  | 'CLP'
  | 'CLF'
  | 'CNY'
  | 'AUD'
  | 'AUD'
  | 'COP'
  | 'COU'
  | 'KMF'
  | 'CDF'
  | 'XAF'
  | 'NZD'
  | 'CRC'
  | 'XOF'
  | 'HRK'
  | 'CUP'
  | 'CUC'
  | 'ANG'
  | 'EUR'
  | 'CZK'
  | 'DKK'
  | 'DJF'
  | 'XCD'
  | 'DOP'
  | 'USD'
  | 'EGP'
  | 'SVC'
  | 'USD'
  | 'XAF'
  | 'ERN'
  | 'EUR'
  | 'ETB'
  | 'EUR'
  | 'FKP'
  | 'DKK'
  | 'FJD'
  | 'EUR'
  | 'EUR'
  | 'EUR'
  | 'XPF'
  | 'EUR'
  | 'XAF'
  | 'GMD'
  | 'GEL'
  | 'EUR'
  | 'GHS'
  | 'GIP'
  | 'EUR'
  | 'DKK'
  | 'XCD'
  | 'EUR'
  | 'USD'
  | 'GTQ'
  | 'GBP'
  | 'GNF'
  | 'XOF'
  | 'GYD'
  | 'HTG'
  | 'USD'
  | 'AUD'
  | 'EUR'
  | 'HNL'
  | 'HKD'
  | 'HUF'
  | 'ISK'
  | 'INR'
  | 'IDR'
  | 'XDR'
  | 'IRR'
  | 'IQD'
  | 'EUR'
  | 'GBP'
  | 'ILS'
  | 'EUR'
  | 'JMD'
  | 'JPY'
  | 'GBP'
  | 'JOD'
  | 'KZT'
  | 'KES'
  | 'AUD'
  | 'KPW'
  | 'KRW'
  | 'KWD'
  | 'KGS'
  | 'LAK'
  | 'EUR'
  | 'LBP'
  | 'LSL'
  | 'ZAR'
  | 'LRD'
  | 'LYD'
  | 'CHF'
  | 'EUR'
  | 'EUR'
  | 'MOP'
  | 'MKD'
  | 'MGA'
  | 'MWK'
  | 'MYR'
  | 'MVR'
  | 'XOF'
  | 'EUR'
  | 'USD'
  | 'EUR'
  | 'MRU'
  | 'MUR'
  | 'EUR'
  | 'XUA'
  | 'MXN'
  | 'MXV'
  | 'USD'
  | 'MDL'
  | 'EUR'
  | 'MNT'
  | 'EUR'
  | 'XCD'
  | 'MAD'
  | 'MZN'
  | 'MMK'
  | 'NAD'
  | 'ZAR'
  | 'AUD'
  | 'NPR'
  | 'EUR'
  | 'XPF'
  | 'NZD'
  | 'NIO'
  | 'XOF'
  | 'NGN'
  | 'NZD'
  | 'AUD'
  | 'USD'
  | 'NOK'
  | 'OMR'
  | 'PKR'
  | 'USD'
  | 'PAB'
  | 'USD'
  | 'PGK'
  | 'PYG'
  | 'PEN'
  | 'PHP'
  | 'NZD'
  | 'PLN'
  | 'EUR'
  | 'USD'
  | 'QAR'
  | 'EUR'
  | 'RON'
  | 'RUB'
  | 'RWF'
  | 'EUR'
  | 'SHP'
  | 'XCD'
  | 'XCD'
  | 'EUR'
  | 'EUR'
  | 'XCD'
  | 'WST'
  | 'EUR'
  | 'STN'
  | 'SAR'
  | 'XOF'
  | 'RSD'
  | 'SCR'
  | 'SLL'
  | 'SGD'
  | 'ANG'
  | 'XSU'
  | 'EUR'
  | 'EUR'
  | 'SBD'
  | 'SOS'
  | 'ZAR'
  | 'SSP'
  | 'EUR'
  | 'LKR'
  | 'SDG'
  | 'SRD'
  | 'NOK'
  | 'SZL'
  | 'SEK'
  | 'CHF'
  | 'CHE'
  | 'CHW'
  | 'SYP'
  | 'TWD'
  | 'TJS'
  | 'TZS'
  | 'THB'
  | 'USD'
  | 'XOF'
  | 'NZD'
  | 'TOP'
  | 'TTD'
  | 'TND'
  | 'TRY'
  | 'TMT'
  | 'USD'
  | 'AUD'
  | 'UGX'
  | 'UAH'
  | 'AED'
  | 'GBP'
  | 'USD'
  | 'USD'
  | 'USN'
  | 'UYU'
  | 'UYI'
  | 'UYW'
  | 'UZS'
  | 'VUV'
  | 'VES'
  | 'VND'
  | 'USD'
  | 'USD'
  | 'XPF'
  | 'MAD'
  | 'YER'
  | 'ZMW'
  | 'ZWL'
  | 'XBA'
  | 'XBB'
  | 'XBC'
  | 'XBD'
  | 'XTS'
  | 'XXX'
  | 'XAU'
  | 'XPD'
  | 'XPT'
  | 'XAG'
