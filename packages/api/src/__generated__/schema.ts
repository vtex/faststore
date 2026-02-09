export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * Example:
   *
   * ```json
   * {
   *   Color: 'Red', Size: '42'
   * }
   * ```
   */
  ActiveVariations: { input: any; output: any; }
  /**
   * Example:
   *
   * ```json
   * {
   *   Color: [
   *     {
   *       src: "https://storecomponents.vtexassets.com/...",
   *       alt: "...",
   *       label: "...",
   *       value: "..."
   *     },
   *     {
   *       src: "https://storecomponents.vtexassets.com/...",
   *       alt: "...",
   *       label: "...",
   *       value: "..."
   *     }
   *   ],
   *   Size: [
   *     {
   *       src: "https://storecomponents.vtexassets.com/...",
   *       alt: "...",
   *       label: "...",
   *       value: "..."
   *     }
   *   ]
   * }
   * ```
   */
  FormattedVariants: { input: any; output: any; }
  JSONObject: { input: any; output: any; }
  ObjectOrString: { input: any; output: any; }
  /**
   * Example:
   *
   * ```json
   * {
   *   'Color-Red-Size-40': 'classic-shoes-37'
   * }
   * ```
   */
  SlugsMap: { input: any; output: any; }
  /**
   * Example:
   *
   * ```json
   * {
   *   Color: [ "Red", "Blue", "Green" ],
   *   Size: [ "40", "41" ]
   * }
   * ```
   */
  VariantsByName: { input: any; output: any; }
};

/** Address information. */
export type Address = {
  __typename?: 'Address';
  /** Address city */
  city?: Maybe<Scalars['String']['output']>;
  /** Address complement */
  complement?: Maybe<Scalars['String']['output']>;
  /** Address country */
  country?: Maybe<Scalars['String']['output']>;
  /** Address geoCoordinates */
  geoCoordinates?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  /** Address neighborhood */
  neighborhood?: Maybe<Scalars['String']['output']>;
  /** Address number */
  number?: Maybe<Scalars['String']['output']>;
  /** Address postal code */
  postalCode?: Maybe<Scalars['String']['output']>;
  /** Address reference */
  reference?: Maybe<Scalars['String']['output']>;
  /** Address state */
  state?: Maybe<Scalars['String']['output']>;
  /** Address street */
  street?: Maybe<Scalars['String']['output']>;
};

/** Advertisement information about a specific product in a campaign */
export type Advertisement = {
  __typename?: 'Advertisement';
  /** Cost of the action, usually Cost Per Click. */
  actionCost: Scalars['Float']['output'];
  /** Advertiser ID of the product. */
  adId: Scalars['String']['output'];
  /** Advertiser Request ID. */
  adRequestId: Scalars['String']['output'];
  /** Advertiser Response ID. */
  adResponseId: Scalars['String']['output'];
  /** Campaign ID. */
  campaignId: Scalars['String']['output'];
};

export type AvailableDeliveryWindows = {
  __typename?: 'AvailableDeliveryWindows';
  /** Available delivery window end date in UTC */
  endDateUtc?: Maybe<Scalars['String']['output']>;
  /** Available delivery window list price */
  listPrice?: Maybe<Scalars['Int']['output']>;
  /** Available delivery window price */
  price?: Maybe<Scalars['Int']['output']>;
  /** Available delivery window start date in UTC */
  startDateUtc?: Maybe<Scalars['String']['output']>;
  /** Available delivery window tax */
  tax?: Maybe<Scalars['Int']['output']>;
};

export type BusinessHour = {
  __typename?: 'BusinessHour';
  /** Business hour closing time. */
  closingTime?: Maybe<Scalars['String']['output']>;
  /** Number that represents the day of the week. */
  dayOfWeek?: Maybe<Scalars['Int']['output']>;
  /** Business hour opening time. */
  openingTime?: Maybe<Scalars['String']['output']>;
};

/** Commercial Authorization dimension status. */
export type CommercialAuthorizationDimensionStatus = {
  __typename?: 'CommercialAuthorizationDimensionStatus';
  /** Creation date. */
  creationDate: Scalars['String']['output'];
  /** Creation environment. */
  creationEnvironment: Scalars['String']['output'];
  /** Creation version. */
  creationVersion: Scalars['String']['output'];
  /** Dimension status ID. */
  id: Scalars['String']['output'];
  /** Dimension status name. */
  name: Scalars['String']['output'];
  /** Priority level. */
  priority: Scalars['Int']['output'];
  /** Indicates if all rules acceptance is required. */
  requireAllRulesAcceptance: Scalars['Boolean']['output'];
  /** Collection of rules for this dimension. */
  ruleCollection: Array<CommercialAuthorizationRule>;
  /** Dimension score. */
  score: Scalars['Float']['output'];
  /** Indicates if simulation should be performed. */
  shouldSimulate: Scalars['Boolean']['output'];
  /** Current status of the dimension. */
  status: CommercialAuthorizationStatus;
  /** Unit ID, if applicable. */
  unitId?: Maybe<Scalars['String']['output']>;
};

/** Commercial Authorization item. */
export type CommercialAuthorizationItem = {
  __typename?: 'CommercialAuthorizationItem';
  /** Additional information as key-value pairs. */
  additionalInfo: Scalars['JSONObject']['output'];
  /** Item ID. */
  id: Scalars['String']['output'];
  /** Item price. */
  price: Scalars['Float']['output'];
  /** Item quantity. */
  quantity: Scalars['Int']['output'];
  /** Item SKU. */
  sku: Scalars['String']['output'];
  /** Total manual discount applied. */
  totalManualDiscount: Scalars['Float']['output'];
  /** Total system discount applied. */
  totalSystemDiscount: Scalars['Float']['output'];
};

/** Commercial Authorization response. */
export type CommercialAuthorizationResponse = {
  __typename?: 'CommercialAuthorizationResponse';
  /** Additional information as key-value pairs. */
  additionalInfo: Scalars['JSONObject']['output'];
  /** Callback endpoint URL. */
  callbackEndpoint: Scalars['String']['output'];
  /** Creation environment. */
  creationEnvironment: Scalars['String']['output'];
  /** Creation version. */
  creationVersion: Scalars['String']['output'];
  /** Dimension status information. */
  dimensionStatus: Array<CommercialAuthorizationDimensionStatus>;
  /** Commercial Authorization ID. */
  id: Scalars['String']['output'];
  /** Collection of items in the commercial authorization. */
  itemCollection: Array<CommercialAuthorizationItem>;
  /** Marketplace payment value. */
  marketPlacePaymentValue: Scalars['Float']['output'];
  /** Order ID associated with the commercial authorization. */
  orderId: Scalars['String']['output'];
  /** Current status of the commercial authorization. */
  status: CommercialAuthorizationStatus;
  /** Total order value desired by the seller. */
  totalOrderValueDesiredBySeller: Scalars['Float']['output'];
  /** List of units. */
  units: Array<Scalars['String']['output']>;
  /** User profile ID. */
  userProfileId: Scalars['String']['output'];
  /** Workflow instance ID. */
  workflowInstanceId: Scalars['String']['output'];
};

/** Commercial Authorization rule. */
export type CommercialAuthorizationRule = {
  __typename?: 'CommercialAuthorizationRule';
  /** Authorization data, if available. */
  authorizationData?: Maybe<CommercialAuthorizationRuleAuthorizationData>;
  /** List of authorized email addresses. */
  authorizedEmails: Array<Scalars['String']['output']>;
  /** DO ID, if applicable. */
  doId?: Maybe<Scalars['String']['output']>;
  /** Rule ID. */
  id: Scalars['String']['output'];
  /**
   * Indicates that the user is listed as one of the possible approvers,
   * but does not necessarily mean that he or she is the next in the chain to approve.
   */
  isUserAuthorized: Scalars['Boolean']['output'];
  /**
   * Indicates that the user is next in the approval chain.
   * This means that they must take an approval or rejection action.
   */
  isUserNextAuthorizer: Scalars['Boolean']['output'];
  /** Rule name. */
  name: Scalars['String']['output'];
  /** Indicates if notification is enabled. */
  notification: Scalars['Boolean']['output'];
  /** Rule priority. */
  priority: Scalars['Int']['output'];
  /** Score interval configuration. */
  scoreInterval: CommercialAuthorizationRuleScoreInterval;
  /** Current status of the rule. */
  status: CommercialAuthorizationStatus;
  /** Timeout value. */
  timeout: Scalars['Int']['output'];
  /** Rule trigger configuration. */
  trigger: CommercialAuthorizationRuleTrigger;
};

/** Commercial Authorization rule authorization data. */
export type CommercialAuthorizationRuleAuthorizationData = {
  __typename?: 'CommercialAuthorizationRuleAuthorizationData';
  /** List of authorizers. */
  authorizers: Array<CommercialAuthorizationRuleAuthorizer>;
  /** Indicates if all approvals are required. */
  requireAllApprovals: Scalars['Boolean']['output'];
};

/** Commercial Authorization rule authorizer. */
export type CommercialAuthorizationRuleAuthorizer = {
  __typename?: 'CommercialAuthorizationRuleAuthorizer';
  /** Authorization date. */
  authorizationDate?: Maybe<Scalars['String']['output']>;
  /** Authorizer email. */
  email?: Maybe<Scalars['String']['output']>;
  /** Authorizer ID. */
  id: Scalars['String']['output'];
  /** Authorizer type. */
  type: Scalars['String']['output'];
};

/** Commercial Authorization rule score interval. */
export type CommercialAuthorizationRuleScoreInterval = {
  __typename?: 'CommercialAuthorizationRuleScoreInterval';
  /** Accept score threshold. */
  accept: Scalars['Float']['output'];
  /** Deny score threshold. */
  deny: Scalars['Float']['output'];
};

/** Commercial Authorization rule trigger. */
export type CommercialAuthorizationRuleTrigger = {
  __typename?: 'CommercialAuthorizationRuleTrigger';
  /** Trigger condition. */
  condition: CommercialAuthorizationRuleTriggerCondition;
  /** Trigger effect. */
  effect: CommercialAuthorizationRuleTriggerEffect;
};

/** Commercial Authorization rule trigger condition. */
export type CommercialAuthorizationRuleTriggerCondition = {
  __typename?: 'CommercialAuthorizationRuleTriggerCondition';
  /** Condition type. */
  conditionType: Scalars['Int']['output'];
  /** Condition description. */
  description?: Maybe<Scalars['String']['output']>;
  /** Condition expression. */
  expression?: Maybe<Scalars['String']['output']>;
  /** Greater than value. */
  greatherThan?: Maybe<Scalars['Float']['output']>;
  /** Less than value. */
  lessThan?: Maybe<Scalars['Float']['output']>;
};

/** Commercial Authorization rule trigger effect. */
export type CommercialAuthorizationRuleTriggerEffect = {
  __typename?: 'CommercialAuthorizationRuleTriggerEffect';
  /** Effect description. */
  description?: Maybe<Scalars['String']['output']>;
  /** Effect type. */
  effectType: Scalars['Int']['output'];
  /** Function path. */
  funcPath?: Maybe<Scalars['String']['output']>;
};

/** Commercial Authorization status. */
export const enum CommercialAuthorizationStatus {
  /** Authorization has been accepted. */
  Accepted = 'accepted',
  /** Authorization has been denied. */
  Denied = 'denied',
  /** Authorization is pending. */
  Pending = 'pending'
};

export type DeliveryIds = {
  __typename?: 'DeliveryIds';
  /** DeliveryIds courier id */
  courierId?: Maybe<Scalars['String']['output']>;
  /** DeliveryIds courier name */
  courierName?: Maybe<Scalars['String']['output']>;
  /** DeliveryIds dock id */
  dockId?: Maybe<Scalars['String']['output']>;
  /** DeliveryIds quantity */
  quantity?: Maybe<Scalars['Int']['output']>;
  /** DeliveryIds warehouse id */
  warehouseId?: Maybe<Scalars['String']['output']>;
};

/** Delivery Promise badge. */
export type DeliveryPromiseBadge = {
  __typename?: 'DeliveryPromiseBadge';
  /** Badge type. */
  typeName?: Maybe<Scalars['String']['output']>;
};

/** Input to get commercial authorizations by order ID. */
export type ICommercialAuthorizationByOrderId = {
  /** Order ID to get commercial authorizations for. */
  orderId: Scalars['String']['input'];
};

export type IGeoCoordinates = {
  /** The latitude of the geographic coordinates. */
  latitude: Scalars['Float']['input'];
  /** The longitude of the geographic coordinates. */
  longitude: Scalars['Float']['input'];
};

/** Person data input to the newsletter. */
export type IPersonNewsletter = {
  /** Person's email. */
  email: Scalars['String']['input'];
  /** Person's name. */
  name: Scalars['String']['input'];
};

/** Input to process order authorization (approve or reject). */
export type IProcessOrderAuthorization = {
  /** Whether the authorization is approved (true) or rejected (false). */
  approved: Scalars['Boolean']['input'];
  /** Dimension ID associated with the authorization. */
  dimensionId: Scalars['String']['input'];
  /** Order authorization ID. */
  orderAuthorizationId: Scalars['String']['input'];
  /** Rule ID associated with the authorization. */
  ruleId: Scalars['String']['input'];
};

/** Input type for setting a new password. */
export type ISetPassword = {
  /** Optional access key for the user, used in some authentication flows. */
  accesskey?: InputMaybe<Scalars['String']['input']>;
  /** The current password of the user, required for verification before changing to the new password. */
  currentPassword: Scalars['String']['input'];
  /** The email of the user for whom the password is being set. */
  email: Scalars['String']['input'];
  /** The new password to be set for the user. */
  newPassword: Scalars['String']['input'];
  /** Optional reCAPTCHA token for security verification. */
  recaptcha?: InputMaybe<Scalars['String']['input']>;
};

/** Shipping Simulation item input. */
export type IShippingItem = {
  /** ShippingItem ID / Sku. */
  id: Scalars['String']['input'];
  /** Number of items. */
  quantity: Scalars['Int']['input'];
  /** Seller responsible for the ShippingItem. */
  seller: Scalars['String']['input'];
};

export type IStoreB2B = {
  contractName?: InputMaybe<Scalars['String']['input']>;
  customerId: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  isRepresentative?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  organizationManager?: InputMaybe<Scalars['Boolean']['input']>;
  savedPostalCode?: InputMaybe<Scalars['String']['input']>;
  unitId?: InputMaybe<Scalars['String']['input']>;
  unitName?: InputMaybe<Scalars['String']['input']>;
  userEmail?: InputMaybe<Scalars['String']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
};

/** Shopping cart input. */
export type IStoreCart = {
  /** Order information, including `orderNumber`, `acceptedOffer` and `shouldSplitItem`. */
  order: IStoreOrder;
};

export type IStoreCurrency = {
  /** Currency code (e.g: USD). */
  code: Scalars['String']['input'];
  /** Currency symbol (e.g: $). */
  symbol: Scalars['String']['input'];
};

export type IStoreDeliveryMode = {
  /** The delivery channel information of the session. */
  deliveryChannel: Scalars['String']['input'];
  /** The delivery method information of the session. */
  deliveryMethod: Scalars['String']['input'];
  /** The delivery window information of the session. */
  deliveryWindow?: InputMaybe<IStoreDeliveryWindow>;
};

/** Delivery window information. */
export type IStoreDeliveryWindow = {
  /** The delivery window end date information. */
  endDate: Scalars['String']['input'];
  /** The delivery window start date information. */
  startDate: Scalars['String']['input'];
};

export type IStoreGeoCoordinates = {
  /** The latitude of the geographic coordinates. */
  latitude: Scalars['Float']['input'];
  /** The longitude of the geographic coordinates. */
  longitude: Scalars['Float']['input'];
};

/** Image input. */
export type IStoreImage = {
  /** Alias for the input image. */
  alternateName: Scalars['String']['input'];
  /** Image input URL. */
  url: Scalars['String']['input'];
};

export type IStoreMarketingData = {
  utmCampaign?: InputMaybe<Scalars['String']['input']>;
  utmMedium?: InputMaybe<Scalars['String']['input']>;
  utmSource?: InputMaybe<Scalars['String']['input']>;
  utmiCampaign?: InputMaybe<Scalars['String']['input']>;
  utmiPage?: InputMaybe<Scalars['String']['input']>;
  utmiPart?: InputMaybe<Scalars['String']['input']>;
};

/** Offer input. */
export type IStoreOffer = {
  /** Information on the item being offered. */
  itemOffered: IStoreProduct;
  /** This is displayed as the "from" price in the context of promotions' price comparison. This may change before it reaches the shelf. */
  listPrice: Scalars['Float']['input'];
  /** Also known as spot price. */
  price: Scalars['Float']['input'];
  /** Number of items offered. */
  quantity: Scalars['Int']['input'];
  /** Seller responsible for the offer. */
  seller: IStoreOrganization;
};

/** Order input. */
export type IStoreOrder = {
  /** Array with information on each accepted offer. */
  acceptedOffer: Array<IStoreOffer>;
  /** ID of the order in [VTEX order management](https://help.vtex.com/en/tutorial/license-manager-resources-oms--60QcBsvWeum02cFi3GjBzg#). */
  orderNumber: Scalars['String']['input'];
  /** Indicates whether or not items with attachments should be split. */
  shouldSplitItem?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Organization input. */
export type IStoreOrganization = {
  /** Organization ID. */
  identifier: Scalars['String']['input'];
};

/** Client profile data. */
export type IStorePerson = {
  /** Client email. */
  email: Scalars['String']['input'];
  /** Client last name. */
  familyName: Scalars['String']['input'];
  /** Client first name. */
  givenName: Scalars['String']['input'];
  /** Client ID. */
  id: Scalars['String']['input'];
};

/** Product input. Products are variants within product groups, equivalent to VTEX [SKUs](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). For example, you may have a **Shirt** product group with associated products such as **Blue shirt size L**, **Green shirt size XL** and so on. */
export type IStoreProduct = {
  /** Custom Product Additional Properties. */
  additionalProperty?: InputMaybe<Array<IStorePropertyValue>>;
  /** Array of product images. */
  image: Array<IStoreImage>;
  /** Product name. */
  name: Scalars['String']['input'];
  /** Stock Keeping Unit. Merchant-specific ID for the product. */
  sku: Scalars['String']['input'];
};

export type IStorePropertyValue = {
  /** Property name. */
  name: Scalars['String']['input'];
  /** Property id. This propert changes according to the content of the object. */
  propertyID?: InputMaybe<Scalars['String']['input']>;
  /** Property value. May hold a string or the string representation of an object. */
  value: Scalars['ObjectOrString']['input'];
  /** Specifies the nature of the value */
  valueReference: Scalars['ObjectOrString']['input'];
};

/** Selected search facet input. */
export type IStoreSelectedFacet = {
  /** Selected search facet key. */
  key: Scalars['String']['input'];
  /** Selected search facet value. */
  value: Scalars['String']['input'];
};

/** Session input. */
export type IStoreSession = {
  /** Session input address type. */
  addressType?: InputMaybe<Scalars['String']['input']>;
  /** Session input b2b. */
  b2b?: InputMaybe<IStoreB2B>;
  /** Session input channel. */
  channel?: InputMaybe<Scalars['String']['input']>;
  /** Session input city. */
  city?: InputMaybe<Scalars['String']['input']>;
  /** Session input country. */
  country: Scalars['String']['input'];
  /** Session input currency. */
  currency: IStoreCurrency;
  /** Session input delivery mode. */
  deliveryMode?: InputMaybe<IStoreDeliveryMode>;
  /** Session input geoCoordinates. */
  geoCoordinates?: InputMaybe<IStoreGeoCoordinates>;
  /** Session input locale. */
  locale: Scalars['String']['input'];
  /** Marketing information input. */
  marketingData?: InputMaybe<IStoreMarketingData>;
  /** Session input person. */
  person?: InputMaybe<IStorePerson>;
  /** Session input postal code. */
  postalCode?: InputMaybe<Scalars['String']['input']>;
  /** Refresh token after Information. */
  refreshAfter?: InputMaybe<Scalars['String']['input']>;
};

/** Input to the cancel order API. */
export type IUserOrderCancel = {
  /** Customer's email. */
  customerEmail?: InputMaybe<Scalars['String']['input']>;
  /** Person's name. */
  orderId: Scalars['String']['input'];
  /** Reason. */
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type LogisticsInfo = {
  __typename?: 'LogisticsInfo';
  /** LogisticsInfo itemIndex. */
  itemIndex?: Maybe<Scalars['String']['output']>;
  /** LogisticsInfo selectedSla. */
  selectedSla?: Maybe<Scalars['String']['output']>;
  /** List of LogisticsInfo ShippingSLA. */
  slas?: Maybe<Array<Maybe<ShippingSla>>>;
};

/** Shipping Simulation Logistic Item. */
export type LogisticsItem = {
  __typename?: 'LogisticsItem';
  /** LogisticsItem availability. */
  availability?: Maybe<Scalars['String']['output']>;
  /** LogisticsItem ID / Sku. */
  id?: Maybe<Scalars['String']['output']>;
  /** LogisticsItem listPrice. */
  listPrice?: Maybe<Scalars['Int']['output']>;
  /** LogisticsItem measurementUnit. */
  measurementUnit?: Maybe<Scalars['String']['output']>;
  /** LogisticsItem price. */
  price?: Maybe<Scalars['Int']['output']>;
  /** Next date in which price is scheduled to change. If there is no scheduled change, this will be set a year in the future from current time. */
  priceValidUntil?: Maybe<Scalars['String']['output']>;
  /** Number of items. */
  quantity?: Maybe<Scalars['Int']['output']>;
  requestIndex?: Maybe<Scalars['Int']['output']>;
  /** LogisticsItem rewardValue. */
  rewardValue?: Maybe<Scalars['Int']['output']>;
  /** Seller responsible for the ShippingItem. */
  seller?: Maybe<Scalars['String']['output']>;
  /** List of Sellers. */
  sellerChain?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** LogisticsItem sellingPrice. */
  sellingPrice?: Maybe<Scalars['Int']['output']>;
  /** LogisticsItem tax. */
  tax?: Maybe<Scalars['Int']['output']>;
  /** LogisticsItem unitMultiplier. */
  unitMultiplier?: Maybe<Scalars['Int']['output']>;
};

export type MessageFields = {
  __typename?: 'MessageFields';
  /** MessageFields ean. */
  ean?: Maybe<Scalars['String']['output']>;
  /** MessageFields item index. */
  itemIndex?: Maybe<Scalars['String']['output']>;
  /** MessageFields sku name. */
  skuName?: Maybe<Scalars['String']['output']>;
};

export type MessageInfo = {
  __typename?: 'MessageInfo';
  /** MessageInfo code. */
  code?: Maybe<Scalars['String']['output']>;
  /** MessageInfo fields. */
  fields?: Maybe<MessageFields>;
  /** MessageInfo status. */
  status?: Maybe<Scalars['String']['output']>;
  /** MessageInfo text. */
  text?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Cancels user order */
  cancelOrder?: Maybe<UserOrderCancel>;
  /** Process Order Authorization */
  processOrderAuthorization?: Maybe<ProcessOrderAuthorizationResponse>;
  /** Subscribes a new person to the newsletter list. */
  subscribeToNewsletter?: Maybe<PersonNewsletter>;
  /** Checks for changes between the cart presented in the UI and the cart stored in the ecommerce platform. If changes are detected, it returns the cart stored on the platform. Otherwise, it returns `null`. */
  validateCart?: Maybe<StoreCart>;
  /** Updates a web session with the specified values. */
  validateSession?: Maybe<StoreSession>;
};


export type MutationCancelOrderArgs = {
  data: IUserOrderCancel;
};


export type MutationProcessOrderAuthorizationArgs = {
  data: IProcessOrderAuthorization;
};


export type MutationSubscribeToNewsletterArgs = {
  data: IPersonNewsletter;
};


export type MutationValidateCartArgs = {
  cart: IStoreCart;
  session?: InputMaybe<IStoreSession>;
};


export type MutationValidateSessionArgs = {
  search: Scalars['String']['input'];
  session: IStoreSession;
};

/** Newsletter information. */
export type PersonNewsletter = {
  __typename?: 'PersonNewsletter';
  /** Person's ID in the newsletter list. */
  id: Scalars['String']['output'];
};

export type PickupAddress = {
  __typename?: 'PickupAddress';
  /** PickupAddress address id. */
  addressId?: Maybe<Scalars['String']['output']>;
  /** PickupAddress address type. */
  addressType?: Maybe<Scalars['String']['output']>;
  /** PickupAddress city. */
  city?: Maybe<Scalars['String']['output']>;
  /** PickupAddress complement. */
  complement?: Maybe<Scalars['String']['output']>;
  /** PickupAddress country. */
  country?: Maybe<Scalars['String']['output']>;
  /** PickupAddress geo coordinates. */
  geoCoordinates?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  /** PickupAddress neighborhood. */
  neighborhood?: Maybe<Scalars['String']['output']>;
  /** PickupAddress number. */
  number?: Maybe<Scalars['String']['output']>;
  /** PickupAddress postal code. */
  postalCode?: Maybe<Scalars['String']['output']>;
  /** PickupAddress receiver name. */
  receiverName?: Maybe<Scalars['String']['output']>;
  /** PickupAddress reference. */
  reference?: Maybe<Scalars['String']['output']>;
  /** PickupAddress state. */
  state?: Maybe<Scalars['String']['output']>;
  /** PickupAddress street. */
  street?: Maybe<Scalars['String']['output']>;
};

export type PickupPointAddress = {
  __typename?: 'PickupPointAddress';
  /** Address city. */
  city?: Maybe<Scalars['String']['output']>;
  /** Address neighborhood. */
  neighborhood?: Maybe<Scalars['String']['output']>;
  /** Address number. */
  number?: Maybe<Scalars['String']['output']>;
  /** Address postal code. */
  postalCode?: Maybe<Scalars['String']['output']>;
  /** Address state. */
  state?: Maybe<Scalars['String']['output']>;
  /** Address street. */
  street?: Maybe<Scalars['String']['output']>;
};

export type PickupPointDistance = {
  __typename?: 'PickupPointDistance';
  /** Pickup point address. */
  address?: Maybe<PickupPointAddress>;
  /** Pickup point business hours. */
  businessHours?: Maybe<Array<Maybe<BusinessHour>>>;
  /** Pickup point distance. */
  distance?: Maybe<Scalars['Float']['output']>;
  /** Whether the pickup point is active. */
  isActive?: Maybe<Scalars['Boolean']['output']>;
  /** Pickup point ID. */
  pickupId?: Maybe<Scalars['String']['output']>;
  /** Pickup point name. */
  pickupName?: Maybe<Scalars['String']['output']>;
};

export type PickupPoints = {
  __typename?: 'PickupPoints';
  /** List of pickup point distances for the given location. */
  pickupPointDistances?: Maybe<Array<Maybe<PickupPointDistance>>>;
  /** Hash of the pickup points data. */
  pickupPointsHash?: Maybe<Scalars['String']['output']>;
};

export type PickupStoreInfo = {
  __typename?: 'PickupStoreInfo';
  /** PickupStoreInfo additional information. */
  additionalInfo?: Maybe<Scalars['String']['output']>;
  /** PickupStoreInfo address. */
  address?: Maybe<PickupAddress>;
  /** PickupStoreInfo dock id. */
  dockId?: Maybe<Scalars['String']['output']>;
  /** PickupStoreInfo friendly name. */
  friendlyName?: Maybe<Scalars['String']['output']>;
  /** Information if the store has pickup enable. */
  isPickupStore?: Maybe<Scalars['Boolean']['output']>;
};

/** Process Order Authorization response. */
export type ProcessOrderAuthorizationResponse = {
  __typename?: 'ProcessOrderAuthorizationResponse';
  /** Indicates if authorization is pending for other authorizers. */
  isPendingForOtherAuthorizer: Scalars['Boolean']['output'];
  /** The updated rule for authorization, if any. */
  ruleForAuthorization?: Maybe<ProcessOrderAuthorizationRule>;
};

/** Extended Commercial Authorization rule with additional process context. */
export type ProcessOrderAuthorizationRule = {
  __typename?: 'ProcessOrderAuthorizationRule';
  /** Dimension ID. */
  dimensionId: Scalars['String']['output'];
  /** Order authorization ID. */
  orderAuthorizationId: Scalars['String']['output'];
  /** Base rule information. */
  rule: CommercialAuthorizationRule;
};

export type ProductCountResult = {
  __typename?: 'ProductCountResult';
  /** Total product count. */
  total: Scalars['Int']['output'];
};

export type Profile = {
  __typename?: 'Profile';
  /** Collection of user's address */
  addresses?: Maybe<Array<Maybe<ProfileAddress>>>;
};

export type ProfileAddress = {
  __typename?: 'ProfileAddress';
  /** ProfileAddress address name/id. */
  addressName?: Maybe<Scalars['String']['output']>;
  /** ProfileAddress address type. */
  addressType?: Maybe<Scalars['String']['output']>;
  /** ProfileAddress city. */
  city?: Maybe<Scalars['String']['output']>;
  /** ProfileAddress complement. */
  complement?: Maybe<Scalars['String']['output']>;
  /** ProfileAddress country. */
  country?: Maybe<Scalars['String']['output']>;
  /** ProfileAddress geo coordinate. */
  geoCoordinate?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  /** ProfileAddress neighborhood. */
  neighborhood?: Maybe<Scalars['String']['output']>;
  /** ProfileAddress number. */
  number?: Maybe<Scalars['String']['output']>;
  /** ProfileAddress postal code. */
  postalCode?: Maybe<Scalars['String']['output']>;
  /** ProfileAddress receiver name. */
  receiverName?: Maybe<Scalars['String']['output']>;
  /** ProfileAddress reference. */
  reference?: Maybe<Scalars['String']['output']>;
  /** ProfileAddress state. */
  state?: Maybe<Scalars['String']['output']>;
  /** ProfileAddress street. */
  street?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  /** Returns the account profile information for the current authenticated user (b2b or b2c user). */
  accountProfile: StoreAccountProfile;
  /** Returns information about all collections. */
  allCollections: StoreCollectionConnection;
  /** Returns information about all products. */
  allProducts: StoreProductConnection;
  /** Returns the details of a collection based on the collection slug. */
  collection: StoreCollection;
  /** Returns the list of Orders that the User can view. */
  listUserOrders?: Maybe<UserOrderListMinimalResult>;
  /** Returns a list of pickup points near to the given geo coordinates. */
  pickupPoints?: Maybe<PickupPoints>;
  /** Returns the details of a product based on the specified locator. */
  product: StoreProduct;
  /** Returns the total product count information based on a specific location accessible through the VTEX segment cookie. */
  productCount?: Maybe<ProductCountResult>;
  /** Returns information about selected products. */
  products: Array<StoreProduct>;
  /** Returns information about the profile. */
  profile?: Maybe<Profile>;
  /** Returns if there's a redirect for a search. */
  redirect?: Maybe<StoreRedirect>;
  /** Returns the result of a product, facet, or suggestion search. */
  search: StoreSearchResult;
  /** Returns a list of sellers available for a specific localization. */
  sellers?: Maybe<SellersData>;
  /** Returns information about shipping simulation. */
  shipping?: Maybe<ShippingData>;
  /** Returns information about the current user details. */
  userDetails: StoreUserDetails;
  /** Returns information about the Details of an User Order. */
  userOrder?: Maybe<UserOrderResult>;
  /** Returns information about the user validation. */
  validateUser?: Maybe<ValidateUserData>;
};


export type QueryAllCollectionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first: Scalars['Int']['input'];
};


export type QueryAllProductsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first: Scalars['Int']['input'];
};


export type QueryCollectionArgs = {
  slug: Scalars['String']['input'];
};


export type QueryListUserOrdersArgs = {
  clientEmail?: InputMaybe<Scalars['String']['input']>;
  dateFinal?: InputMaybe<Scalars['String']['input']>;
  dateInitial?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pendingMyApproval?: InputMaybe<Scalars['Boolean']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type QueryPickupPointsArgs = {
  geoCoordinates?: InputMaybe<IStoreGeoCoordinates>;
};


export type QueryProductArgs = {
  locator: Array<IStoreSelectedFacet>;
};


export type QueryProductCountArgs = {
  term?: InputMaybe<Scalars['String']['input']>;
};


export type QueryProductsArgs = {
  productIds: Array<Scalars['String']['input']>;
};


export type QueryProfileArgs = {
  id: Scalars['String']['input'];
};


export type QueryRedirectArgs = {
  selectedFacets?: InputMaybe<Array<IStoreSelectedFacet>>;
  term?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySearchArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first: Scalars['Int']['input'];
  selectedFacets?: InputMaybe<Array<IStoreSelectedFacet>>;
  sort?: InputMaybe<StoreSort>;
  sponsoredCount?: InputMaybe<Scalars['Int']['input']>;
  term?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySellersArgs = {
  country: Scalars['String']['input'];
  geoCoordinates?: InputMaybe<IGeoCoordinates>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  salesChannel?: InputMaybe<Scalars['String']['input']>;
};


export type QueryShippingArgs = {
  country: Scalars['String']['input'];
  items: Array<IShippingItem>;
  postalCode: Scalars['String']['input'];
};


export type QueryUserOrderArgs = {
  orderId: Scalars['String']['input'];
};

export type SkuSpecificationField = {
  __typename?: 'SKUSpecificationField';
  id?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  originalName?: Maybe<Scalars['String']['output']>;
};

export type SkuSpecificationValue = {
  __typename?: 'SKUSpecificationValue';
  fieldId?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  originalName?: Maybe<Scalars['String']['output']>;
};

/** Search result. */
export type SearchMetadata = {
  __typename?: 'SearchMetadata';
  /** Indicates how the search engine corrected the misspelled word by using fuzzy logic. */
  fuzzy?: Maybe<Scalars['String']['output']>;
  /** Indicates if the search term was misspelled. */
  isTermMisspelled: Scalars['Boolean']['output'];
  /** Logical operator used to run the search. */
  logicalOperator: Scalars['String']['output'];
};

/** Information of sellers. */
export type SellerInfo = {
  __typename?: 'SellerInfo';
  /** Identification of the seller */
  id?: Maybe<Scalars['String']['output']>;
  /** Logo of the seller */
  logo?: Maybe<Scalars['String']['output']>;
  /** Name of the seller */
  name?: Maybe<Scalars['String']['output']>;
};

/** Regionalization with sellers information. */
export type SellersData = {
  __typename?: 'SellersData';
  /** Identification of region. */
  id?: Maybe<Scalars['String']['output']>;
  /** List of sellers. */
  sellers?: Maybe<Array<Maybe<SellerInfo>>>;
};

/** Response type for setting a new password. */
export type SetPasswordResponse = {
  __typename?: 'SetPasswordResponse';
  /** Message providing additional information about the operation. */
  message?: Maybe<Scalars['String']['output']>;
  /** Indicates whether the password was successfully set. */
  success: Scalars['Boolean']['output'];
};

/** Shipping Simulation information. */
export type ShippingData = {
  __typename?: 'ShippingData';
  /** Address information. */
  address?: Maybe<Address>;
  /** List of LogisticsItem. */
  items?: Maybe<Array<Maybe<LogisticsItem>>>;
  /** List of LogisticsInfo. */
  logisticsInfo?: Maybe<Array<Maybe<LogisticsInfo>>>;
  /** List of MessageInfo. */
  messages?: Maybe<Array<Maybe<MessageInfo>>>;
};

export type ShippingSla = {
  __typename?: 'ShippingSLA';
  /** ShippingSLA available delivery windows. */
  availableDeliveryWindows?: Maybe<Array<Maybe<AvailableDeliveryWindows>>>;
  /** ShippingSLA carrier. */
  carrier?: Maybe<Scalars['String']['output']>;
  /** ShippingSLA delivery channel. */
  deliveryChannel?: Maybe<Scalars['String']['output']>;
  /** List of ShippingSLA delivery ids. */
  deliveryIds?: Maybe<Array<Maybe<DeliveryIds>>>;
  /** ShippingSLA friendly name. */
  friendlyName?: Maybe<Scalars['String']['output']>;
  /** ShippingSLA id. */
  id?: Maybe<Scalars['String']['output']>;
  /**
   * ShippingSLA localized shipping estimate.
   * Note: this will always return a localized string for locale `en-US`.
   */
  localizedEstimates?: Maybe<Scalars['String']['output']>;
  /** ShippingSLA name. */
  name?: Maybe<Scalars['String']['output']>;
  /** ShippingSLA pickup distance. */
  pickupDistance?: Maybe<Scalars['Float']['output']>;
  /** ShippingSLA pickup point id. */
  pickupPointId?: Maybe<Scalars['String']['output']>;
  /** ShippingSLA pickup store info. */
  pickupStoreInfo?: Maybe<PickupStoreInfo>;
  /** ShippingSLA price. */
  price?: Maybe<Scalars['Float']['output']>;
  /** ShippingSLA shipping estimate. */
  shippingEstimate?: Maybe<Scalars['String']['output']>;
  /** ShippingSLA shipping estimate date. */
  shippingEstimateDate?: Maybe<Scalars['String']['output']>;
};

export type SkuSpecification = {
  __typename?: 'SkuSpecification';
  field: SkuSpecificationField;
  values: Array<SkuSpecificationValue>;
};

export type SkuVariants = {
  __typename?: 'SkuVariants';
  /** SKU property values for the current SKU. */
  activeVariations?: Maybe<Scalars['ActiveVariations']['output']>;
  /** All available options for each SKU variant property, indexed by their name. */
  allVariantProducts?: Maybe<Array<StoreProduct>>;
  /** All available options for each SKU variant property, indexed by their name. */
  allVariantsByName?: Maybe<Scalars['VariantsByName']['output']>;
  /**
   * Available options for each varying SKU property, taking into account the
   * `dominantVariantName` property. Returns all available options for the
   * dominant property, and only options that can be combined with its current
   * value for other properties.
   * If `dominantVariantName` is not present, the first variant will be
   * considered the dominant one.
   */
  availableVariations?: Maybe<Scalars['FormattedVariants']['output']>;
  /**
   * Maps property value combinations to their respective SKU's slug. Enables
   * us to retrieve the slug for the SKU that matches the currently selected
   * variations in O(1) time.
   * If `dominantVariantName` is not present, the first variant will be
   * considered the dominant one.
   */
  slugsMap?: Maybe<Scalars['SlugsMap']['output']>;
};


export type SkuVariantsAvailableVariationsArgs = {
  dominantVariantName?: InputMaybe<Scalars['String']['input']>;
};


export type SkuVariantsSlugsMapArgs = {
  dominantVariantName?: InputMaybe<Scalars['String']['input']>;
};

export type Specification = {
  __typename?: 'Specification';
  name: Scalars['String']['output'];
  originalName: Scalars['String']['output'];
  values: Array<Scalars['String']['output']>;
};

export type SpecificationGroup = {
  __typename?: 'SpecificationGroup';
  name: Scalars['String']['output'];
  originalName: Scalars['String']['output'];
  specifications: Array<Specification>;
};

/** Account profile information. */
export type StoreAccountProfile = {
  __typename?: 'StoreAccountProfile';
  email?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

/** Aggregate offer information, for a given SKU that is available to be fulfilled by multiple sellers. */
export type StoreAggregateOffer = {
  __typename?: 'StoreAggregateOffer';
  /** Highest price among all sellers. */
  highPrice: Scalars['Float']['output'];
  /** Lowest price among all sellers. */
  lowPrice: Scalars['Float']['output'];
  /** Lowest price among all sellers with current taxes. */
  lowPriceWithTaxes: Scalars['Float']['output'];
  /** Number of sellers selling this SKU. */
  offerCount: Scalars['Int']['output'];
  /** Array with information on each available offer. */
  offers: Array<StoreOffer>;
  /** ISO code of the currency used for the offer prices. */
  priceCurrency: Scalars['String']['output'];
};

/** Average rating, based on multiple ratings or reviews. */
export type StoreAggregateRating = {
  __typename?: 'StoreAggregateRating';
  /** Value of the aggregate rating. */
  ratingValue: Scalars['Float']['output'];
  /** Total number of ratings. */
  reviewCount: Scalars['Int']['output'];
};

/** information about the author of a product review or rating. */
export type StoreAuthor = {
  __typename?: 'StoreAuthor';
  /** Author name. */
  name: Scalars['String']['output'];
};

export type StoreB2B = {
  __typename?: 'StoreB2B';
  contractName?: Maybe<Scalars['String']['output']>;
  customerId: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  isRepresentative?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  organizationManager?: Maybe<Scalars['Boolean']['output']>;
  savedPostalCode?: Maybe<Scalars['String']['output']>;
  unitId?: Maybe<Scalars['String']['output']>;
  unitName?: Maybe<Scalars['String']['output']>;
  userEmail?: Maybe<Scalars['String']['output']>;
  userName?: Maybe<Scalars['String']['output']>;
};

/** Brand of a given product. */
export type StoreBrand = {
  __typename?: 'StoreBrand';
  /** Brand name. */
  name: Scalars['String']['output'];
};

/** List of items consisting of chain linked web pages, ending with the current page. */
export type StoreBreadcrumbList = {
  __typename?: 'StoreBreadcrumbList';
  /** Array with breadcrumb elements. */
  itemListElement: Array<StoreListItem>;
  /** Number of breadcrumbs in the list. */
  numberOfItems: Scalars['Int']['output'];
};

/** Shopping cart information. */
export type StoreCart = {
  __typename?: 'StoreCart';
  /** List of shopping cart messages. */
  messages: Array<StoreCartMessage>;
  /** Order information, including `orderNumber`, `acceptedOffer` and `shouldSplitItem`. */
  order: StoreOrder;
};

/** Shopping cart message. */
export type StoreCartMessage = {
  __typename?: 'StoreCartMessage';
  /** Shopping cart message status, which can be `INFO`, `WARNING` or `ERROR`. */
  status: StoreStatus;
  /** Shopping cart message text. */
  text: Scalars['String']['output'];
};

/** Product collection information. */
export type StoreCollection = {
  __typename?: 'StoreCollection';
  /** List of items consisting of chain linked web pages, ending with the current page. */
  breadcrumbList: StoreBreadcrumbList;
  /** Collection ID. */
  id: Scalars['ID']['output'];
  /** Collection meta information. Used for search. */
  meta: StoreCollectionMeta;
  /** Meta tag data. */
  seo: StoreSeo;
  /** Corresponding collection URL slug, with which to retrieve this entity. */
  slug: Scalars['String']['output'];
  /** Collection type. */
  type: StoreCollectionType;
};

/** Collection connections, including pagination information and collections returned by the query. */
export type StoreCollectionConnection = {
  __typename?: 'StoreCollectionConnection';
  /** Array with collection connection page edges, each containing a collection and a corresponding cursor.. */
  edges: Array<StoreCollectionEdge>;
  /** Collection pagination information. */
  pageInfo: StorePageInfo;
};

/** Each collection edge contains a `node`, with product collection information, and a `cursor`, that can be used as a reference for pagination. */
export type StoreCollectionEdge = {
  __typename?: 'StoreCollectionEdge';
  /** Collection cursor. Used as pagination reference. */
  cursor: Scalars['String']['output'];
  /** Each collection node contains the information of a product collection returned by the query. */
  node: StoreCollection;
};

/** Product collection facet, used for search. */
export type StoreCollectionFacet = {
  __typename?: 'StoreCollectionFacet';
  /** Facet key. */
  key: Scalars['String']['output'];
  /** Facet value. */
  value: Scalars['String']['output'];
};

/** Collection meta information. Used for search. */
export type StoreCollectionMeta = {
  __typename?: 'StoreCollectionMeta';
  /** List of selected collection facets. */
  selectedFacets: Array<StoreCollectionFacet>;
};

/** Product collection type. Possible values are `Department`, `Category`, `Brand`, `Cluster`, `SubCategory` or `Collection`. */
export const enum StoreCollectionType {
  /** Product brand. */
  Brand = 'Brand',
  /** Second level of product categorization. */
  Category = 'Category',
  /** Product cluster. */
  Cluster = 'Cluster',
  /** Product collection. */
  Collection = 'Collection',
  /** First level of product categorization. */
  Department = 'Department',
  /** Third level of product categorization. */
  SubCategory = 'SubCategory'
};

/** Currency information. */
export type StoreCurrency = {
  __typename?: 'StoreCurrency';
  /** Currency code (e.g: USD). */
  code: Scalars['String']['output'];
  /** Currency symbol (e.g: $). */
  symbol: Scalars['String']['output'];
};

/** Delivery mode information. */
export type StoreDeliveryMode = {
  __typename?: 'StoreDeliveryMode';
  /** The delivery channel information of the session. */
  deliveryChannel: Scalars['String']['output'];
  /** The delivery method information of the session. */
  deliveryMethod: Scalars['String']['output'];
  /** The delivery window information of the session. */
  deliveryWindow?: Maybe<StoreDeliveryWindow>;
};

/** Delivery window information. */
export type StoreDeliveryWindow = {
  __typename?: 'StoreDeliveryWindow';
  /** The delivery window end date information. */
  endDate: Scalars['String']['output'];
  /** The delivery window start date information. */
  startDate: Scalars['String']['output'];
};

export type StoreFacet = StoreFacetBoolean | StoreFacetRange;

/** Search facet boolean information. */
export type StoreFacetBoolean = {
  __typename?: 'StoreFacetBoolean';
  /** Facet key. */
  key: Scalars['String']['output'];
  /** Facet label. */
  label: Scalars['String']['output'];
  /** Array with information on each facet value. */
  values: Array<StoreFacetValueBoolean>;
};

/** Search facet range information. */
export type StoreFacetRange = {
  __typename?: 'StoreFacetRange';
  /** Facet key. */
  key: Scalars['String']['output'];
  /** Facet label. */
  label: Scalars['String']['output'];
  /** Maximum facet range value. */
  max: StoreFacetValueRange;
  /** Minimum facet range value. */
  min: StoreFacetValueRange;
};

/** Search facet type. */
export const enum StoreFacetType {
  /** Indicates boolean search facet. */
  Boolean = 'BOOLEAN',
  /** Indicates range type search facet. */
  Range = 'RANGE'
};

/** Information of a specific facet value. */
export type StoreFacetValueBoolean = {
  __typename?: 'StoreFacetValueBoolean';
  /** Facet value label. */
  label: Scalars['String']['output'];
  /** Number of items with this facet. */
  quantity?: Maybe<Scalars['Int']['output']>;
  /** Indicates whether facet is selected. */
  selected: Scalars['Boolean']['output'];
  /** Facet value. */
  value: Scalars['String']['output'];
};

/** Search facet range value information. Used for minimum and maximum range values. */
export type StoreFacetValueRange = {
  __typename?: 'StoreFacetValueRange';
  /** Search facet range absolute value. */
  absolute: Scalars['Float']['output'];
  /** Search facet range selected value. */
  selected: Scalars['Float']['output'];
};

/** Geographic coordinates information. */
export type StoreGeoCoordinates = {
  __typename?: 'StoreGeoCoordinates';
  /** The latitude of the geographic coordinates. */
  latitude: Scalars['Float']['output'];
  /** The longitude of the geographic coordinates. */
  longitude: Scalars['Float']['output'];
};

/** Image. */
export type StoreImage = {
  __typename?: 'StoreImage';
  /** Alias for the image. */
  alternateName: Scalars['String']['output'];
  /** Image URL. */
  url: Scalars['String']['output'];
};

/** Item of a list. */
export type StoreListItem = {
  __typename?: 'StoreListItem';
  /** List item value. */
  item: Scalars['String']['output'];
  /** Name of the list item. */
  name: Scalars['String']['output'];
  /** Position of the item in the list. */
  position: Scalars['Int']['output'];
};

/** Marketing information. */
export type StoreMarketingData = {
  __typename?: 'StoreMarketingData';
  utmCampaign?: Maybe<Scalars['String']['output']>;
  utmMedium?: Maybe<Scalars['String']['output']>;
  utmSource?: Maybe<Scalars['String']['output']>;
  utmiCampaign?: Maybe<Scalars['String']['output']>;
  utmiPage?: Maybe<Scalars['String']['output']>;
  utmiPart?: Maybe<Scalars['String']['output']>;
};

/** Offer information. */
export type StoreOffer = {
  __typename?: 'StoreOffer';
  /** Offer item availability. */
  availability: Scalars['String']['output'];
  /** Offer item condition. */
  itemCondition: Scalars['String']['output'];
  /** Information on the item being offered. */
  itemOffered: StoreProduct;
  /** This is displayed as the "from" price in the context of promotions' price comparison. This may change before it reaches the shelf. */
  listPrice: Scalars['Float']['output'];
  /** List price among with current taxes. */
  listPriceWithTaxes: Scalars['Float']['output'];
  /** Also known as spot price. */
  price: Scalars['Float']['output'];
  /** ISO code of the currency used for the offer prices. */
  priceCurrency: Scalars['String']['output'];
  /** Next date in which price is scheduled to change. If there is no scheduled change, this will be set a year in the future from current time. */
  priceValidUntil: Scalars['String']['output'];
  /** Also known as spot price with taxes. */
  priceWithTaxes: Scalars['Float']['output'];
  /** Number of items offered. */
  quantity: Scalars['Int']['output'];
  /** Seller responsible for the offer. */
  seller: StoreOrganization;
  /** Computed price before applying coupons, taxes or benefits. This may change before it reaches the shelf. */
  sellingPrice: Scalars['Float']['output'];
};

/** Information of a specific order. */
export type StoreOrder = {
  __typename?: 'StoreOrder';
  /** Array with information on each accepted offer. */
  acceptedOffer: Array<StoreOffer>;
  /** ID of the order in [VTEX order management](https://help.vtex.com/en/tutorial/license-manager-resources-oms--60QcBsvWeum02cFi3GjBzg#). */
  orderNumber: Scalars['String']['output'];
  /** Indicates whether or not items with attachments should be split. */
  shouldSplitItem?: Maybe<Scalars['Boolean']['output']>;
};

/** Organization. */
export type StoreOrganization = {
  __typename?: 'StoreOrganization';
  /** Organization ID. */
  identifier: Scalars['String']['output'];
};

/** Whenever you make a query that allows for pagination, such as `allProducts` or `allCollections`, you can check `StorePageInfo` to learn more about the complete set of items and use it to paginate your queries. */
export type StorePageInfo = {
  __typename?: 'StorePageInfo';
  /** Cursor corresponding to the last possible item. */
  endCursor: Scalars['String']['output'];
  /** Indicates whether there is at least one more page with items after the ones returned in the current query. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Indicates whether there is at least one more page with items before the ones returned in the current query. */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** Cursor corresponding to the first possible item. */
  startCursor: Scalars['String']['output'];
  /** Total number of items (products or collections), not pages. */
  totalCount: Scalars['Int']['output'];
};

/** Client profile data. */
export type StorePerson = {
  __typename?: 'StorePerson';
  /** Client email. */
  email: Scalars['String']['output'];
  /** Client last name. */
  familyName: Scalars['String']['output'];
  /** Client first name. */
  givenName: Scalars['String']['output'];
  /** Client ID. */
  id: Scalars['String']['output'];
};

/** Product information. Products are variants within product groups, equivalent to VTEX [SKUs](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). For example, you may have a **Shirt** product group with associated products such as **Blue shirt size L**, **Green shirt size XL** and so on. */
export type StoreProduct = {
  __typename?: 'StoreProduct';
  /** Array of additional properties. */
  additionalProperty: Array<StorePropertyValue>;
  /** Advertisement information about the product. */
  advertisement?: Maybe<Advertisement>;
  /** Aggregate ratings data. */
  aggregateRating: StoreAggregateRating;
  /** Product brand. */
  brand: StoreBrand;
  /** List of items consisting of chain linked web pages, ending with the current page. */
  breadcrumbList: StoreBreadcrumbList;
  /** Delivery Promise product's badge. */
  deliveryPromiseBadges?: Maybe<Array<Maybe<DeliveryPromiseBadge>>>;
  /** Product description. */
  description: Scalars['String']['output'];
  /** Global Trade Item Number. */
  gtin: Scalars['String']['output'];
  /** Indicates whether the product has specifications. */
  hasSpecifications?: Maybe<Scalars['Boolean']['output']>;
  /** Array of images. */
  image: Array<StoreImage>;
  /** Indicates product group related to this product. */
  isVariantOf: StoreProductGroup;
  /** Product name. */
  name: Scalars['String']['output'];
  /** Aggregate offer information. */
  offers: StoreAggregateOffer;
  /** Product ID, such as [ISBN](https://www.isbn-international.org/content/what-isbn) or similar global IDs. */
  productID: Scalars['String']['output'];
  /** The product's release date. Formatted using https://en.wikipedia.org/wiki/ISO_8601 */
  releaseDate: Scalars['String']['output'];
  /** Array with review information. */
  review: Array<StoreReview>;
  /** Meta tag data. */
  seo: StoreSeo;
  /** Stock Keeping Unit. Merchant-specific ID for the product. */
  sku: Scalars['String']['output'];
  /** Indicate the specifications of a product. */
  skuSpecifications: Array<SkuSpecification>;
  /** Corresponding collection URL slug, with which to retrieve this entity. */
  slug: Scalars['String']['output'];
  /** Indicate the specifications of a group of SKUs. */
  specificationGroups: Array<SpecificationGroup>;
  /** Sku Unit Multiplier */
  unitMultiplier?: Maybe<Scalars['Float']['output']>;
};


/** Product information. Products are variants within product groups, equivalent to VTEX [SKUs](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). For example, you may have a **Shirt** product group with associated products such as **Blue shirt size L**, **Green shirt size XL** and so on. */
export type StoreProductImageArgs = {
  context?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};

/** Product connections, including pagination information and products returned by the query. */
export type StoreProductConnection = {
  __typename?: 'StoreProductConnection';
  /** Array with product connection edges, each containing a product and a corresponding cursor. */
  edges: Array<StoreProductEdge>;
  /** Product pagination information. */
  pageInfo: StorePageInfo;
};

/** Each product edge contains a `node`, with product information, and a `cursor`, that can be used as a reference for pagination. */
export type StoreProductEdge = {
  __typename?: 'StoreProductEdge';
  /** Product cursor. Used as pagination reference. */
  cursor: Scalars['String']['output'];
  /** Each product node contains the information of a product returned by the query. */
  node: StoreProduct;
};

/** Product group information. Product groups are catalog entities that may contain variants. They are equivalent to VTEX [Products](https://help.vtex.com/en/tutorial/what-is-a-product--2zrB2gFCHyQokCKKE8kuAw#), whereas each variant is equivalent to a VTEX [SKU](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). For example, you may have a **Shirt** product group with associated products such as **Blue shirt size L**, **Green shirt size XL** and so on. */
export type StoreProductGroup = {
  __typename?: 'StoreProductGroup';
  /** Array of additional properties. */
  additionalProperty: Array<StorePropertyValue>;
  /** Array of variants related to product group. Variants are equivalent to VTEX [SKUs](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). */
  hasVariant: Array<StoreProduct>;
  /** Product group name. */
  name: Scalars['String']['output'];
  /** Product group ID. */
  productGroupID: Scalars['String']['output'];
  /**
   * Object containing data structures to facilitate handling different SKU
   * variant properties. Specially useful for implementing SKU selection
   * components.
   */
  skuVariants?: Maybe<SkuVariants>;
};

/** Properties that can be associated with products and products groups. */
export type StorePropertyValue = {
  __typename?: 'StorePropertyValue';
  /** Property name. */
  name: Scalars['String']['output'];
  /** Property id. This propert changes according to the content of the object. */
  propertyID: Scalars['String']['output'];
  /** Property value. May hold a string or the string representation of an object. */
  value: Scalars['ObjectOrString']['output'];
  /** Specifies the nature of the value */
  valueReference: Scalars['ObjectOrString']['output'];
};

/**
 * Redirect informations, including url returned by the query.
 * https://schema.org/Thing
 */
export type StoreRedirect = {
  __typename?: 'StoreRedirect';
  /** URL to redirect */
  url?: Maybe<Scalars['String']['output']>;
};

/** Information of a given review. */
export type StoreReview = {
  __typename?: 'StoreReview';
  /** Review author. */
  author: StoreAuthor;
  /** Review rating information. */
  reviewRating: StoreReviewRating;
};

/** Information of a given review rating. */
export type StoreReviewRating = {
  __typename?: 'StoreReviewRating';
  /** Best rating value. */
  bestRating: Scalars['Float']['output'];
  /** Rating value. */
  ratingValue: Scalars['Float']['output'];
};

/** Search result. */
export type StoreSearchResult = {
  __typename?: 'StoreSearchResult';
  /** Array of search result facets. */
  facets: Array<StoreFacet>;
  /** Search result metadata. Additional data can be used to send analytics events. */
  metadata?: Maybe<SearchMetadata>;
  /** Search result products. */
  products: StoreProductConnection;
  /** Search result suggestions. */
  suggestions: StoreSuggestions;
};

/** Search Engine Optimization (SEO) tags data. */
export type StoreSeo = {
  __typename?: 'StoreSeo';
  /** Canonical tag. */
  canonical: Scalars['String']['output'];
  /** Description tag. */
  description: Scalars['String']['output'];
  /** Title tag. */
  title: Scalars['String']['output'];
  /** Title template tag. */
  titleTemplate: Scalars['String']['output'];
};

/** Session information. */
export type StoreSession = {
  __typename?: 'StoreSession';
  /** Session address type. */
  addressType?: Maybe<Scalars['String']['output']>;
  /** B2B Information. */
  b2b?: Maybe<StoreB2B>;
  /** Session channel. */
  channel?: Maybe<Scalars['String']['output']>;
  /** Session city. */
  city?: Maybe<Scalars['String']['output']>;
  /** Session country. */
  country: Scalars['String']['output'];
  /** Session currency. */
  currency: StoreCurrency;
  /** Session delivery mode. */
  deliveryMode?: Maybe<StoreDeliveryMode>;
  /** Session input geoCoordinates. */
  geoCoordinates?: Maybe<StoreGeoCoordinates>;
  /** Session locale. */
  locale: Scalars['String']['output'];
  /** Marketing information. */
  marketingData?: Maybe<StoreMarketingData>;
  /** Session input person. */
  person?: Maybe<StorePerson>;
  /** Session postal code. */
  postalCode?: Maybe<Scalars['String']['output']>;
  /** Refresh token after Information. */
  refreshAfter?: Maybe<Scalars['String']['output']>;
};

/** Product search results sorting options. */
export const enum StoreSort {
  /** Sort by discount value, from highest to lowest. */
  DiscountDesc = 'discount_desc',
  /** Sort by name, in alphabetical order. */
  NameAsc = 'name_asc',
  /** Sort by name, in reverse alphabetical order. */
  NameDesc = 'name_desc',
  /** Sort by orders, from highest to lowest. */
  OrdersDesc = 'orders_desc',
  /** Sort by price, from lowest to highest. */
  PriceAsc = 'price_asc',
  /** Sort by price, from highest to lowest. */
  PriceDesc = 'price_desc',
  /** Sort by release date, from  highest to lowest. */
  ReleaseDesc = 'release_desc',
  /** Sort by product score, from highest to lowest. */
  ScoreDesc = 'score_desc'
};

/** Status used to indicate a message type. For instance, a shopping cart informative or error message. */
export const enum StoreStatus {
  Error = 'ERROR',
  Info = 'INFO',
  Warning = 'WARNING'
};

/** Suggestion term. */
export type StoreSuggestionTerm = {
  __typename?: 'StoreSuggestionTerm';
  /** Its occurrences count. */
  count: Scalars['Int']['output'];
  /** The term. */
  value: Scalars['String']['output'];
};

/** Suggestions information. */
export type StoreSuggestions = {
  __typename?: 'StoreSuggestions';
  /** Array with suggestion products' information. */
  products: Array<StoreProduct>;
  /** Array with suggestion terms. */
  terms: Array<StoreSuggestionTerm>;
};

/** User details information. */
export type StoreUserDetails = {
  __typename?: 'StoreUserDetails';
  /** User's email. */
  email?: Maybe<Scalars['String']['output']>;
  /** User's name. */
  name?: Maybe<Scalars['String']['output']>;
  /** User's organizational unit. */
  orgUnit?: Maybe<Scalars['String']['output']>;
  /** User's role. */
  role?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type UserOrder = {
  __typename?: 'UserOrder';
  affiliateId?: Maybe<Scalars['String']['output']>;
  allowCancellation?: Maybe<Scalars['Boolean']['output']>;
  allowEdition?: Maybe<Scalars['Boolean']['output']>;
  authorizedDate?: Maybe<Scalars['String']['output']>;
  budgetData?: Maybe<UserOrderBudgetData>;
  callCenterOperatorData?: Maybe<Scalars['String']['output']>;
  canProcessOrderAuthorization?: Maybe<Scalars['Boolean']['output']>;
  cancelReason?: Maybe<Scalars['String']['output']>;
  cancellationData?: Maybe<UserOrderCancellationData>;
  cancellationRequests?: Maybe<Array<Maybe<UserOrderCancellationRequest>>>;
  changesAttachment?: Maybe<Scalars['String']['output']>;
  checkedInPickupPointId?: Maybe<Scalars['String']['output']>;
  clientPreferencesData?: Maybe<UserOrderClientPreferencesData>;
  clientProfileData?: Maybe<UserOrderClientProfileData>;
  commercialConditionData?: Maybe<Scalars['String']['output']>;
  creationDate?: Maybe<Scalars['String']['output']>;
  customData?: Maybe<UserOrderCustomData>;
  customFields?: Maybe<Array<Maybe<UserOrderCustomFieldsGrouped>>>;
  deliveryOptionsData?: Maybe<UserOrderDeliveryOptionsData>;
  followUpEmail?: Maybe<Scalars['String']['output']>;
  giftRegistryData?: Maybe<Scalars['String']['output']>;
  hostname?: Maybe<Scalars['String']['output']>;
  invoiceData?: Maybe<Scalars['String']['output']>;
  invoicedDate?: Maybe<Scalars['String']['output']>;
  isCheckedIn?: Maybe<Scalars['Boolean']['output']>;
  isCompleted?: Maybe<Scalars['Boolean']['output']>;
  itemMetadata?: Maybe<UserOrderItemMetadata>;
  items?: Maybe<Array<Maybe<UserOrderItems>>>;
  lastChange?: Maybe<Scalars['String']['output']>;
  lastMessage?: Maybe<Scalars['String']['output']>;
  marketingData?: Maybe<Scalars['String']['output']>;
  marketplace?: Maybe<UserOrderMarketplace>;
  marketplaceItems?: Maybe<Array<Maybe<UserOrderItems>>>;
  marketplaceOrderId?: Maybe<Scalars['String']['output']>;
  marketplaceServicesEndpoint?: Maybe<Scalars['String']['output']>;
  merchantName?: Maybe<Scalars['String']['output']>;
  openTextField?: Maybe<Scalars['String']['output']>;
  orderFormId?: Maybe<Scalars['String']['output']>;
  orderGroup?: Maybe<Scalars['String']['output']>;
  orderId?: Maybe<Scalars['String']['output']>;
  origin?: Maybe<Scalars['String']['output']>;
  packageAttachment?: Maybe<UserOrderPackageAttachment>;
  paymentData?: Maybe<UserOrderPaymentData>;
  purchaseAgentData?: Maybe<UserOrderPurchaseAgentData>;
  ratesAndBenefitsData?: Maybe<UserOrderRatesAndBenefitsData>;
  roundingError?: Maybe<Scalars['Int']['output']>;
  ruleForAuthorization?: Maybe<ProcessOrderAuthorizationRule>;
  salesChannel?: Maybe<Scalars['String']['output']>;
  sellerOrderId?: Maybe<Scalars['String']['output']>;
  sellers?: Maybe<Array<Maybe<UserOrderStoreSellers>>>;
  sequence?: Maybe<Scalars['String']['output']>;
  shippingData?: Maybe<UserOrderShippingData>;
  status?: Maybe<Scalars['String']['output']>;
  statusDescription?: Maybe<Scalars['String']['output']>;
  storePreferencesData?: Maybe<UserOrderStorePreferencesData>;
  subscriptionData?: Maybe<Scalars['String']['output']>;
  taxData?: Maybe<Scalars['String']['output']>;
  totals?: Maybe<Array<Maybe<UserOrderTotals>>>;
  value?: Maybe<Scalars['Float']['output']>;
  workflowIsInError?: Maybe<Scalars['Boolean']['output']>;
};

export type UserOrderAdditionalInfo = {
  __typename?: 'UserOrderAdditionalInfo';
  brandId?: Maybe<Scalars['String']['output']>;
  brandName?: Maybe<Scalars['String']['output']>;
  categories?: Maybe<Array<Maybe<UserOrderCategories>>>;
  categoriesIds?: Maybe<Scalars['String']['output']>;
  commercialConditionId?: Maybe<Scalars['String']['output']>;
  dimension?: Maybe<UserOrderDimension>;
  offeringInfo?: Maybe<Scalars['String']['output']>;
  offeringType?: Maybe<Scalars['String']['output']>;
  offeringTypeId?: Maybe<Scalars['String']['output']>;
  productClusterId?: Maybe<Scalars['String']['output']>;
};

export type UserOrderAddress = {
  __typename?: 'UserOrderAddress';
  addressId?: Maybe<Scalars['String']['output']>;
  addressType?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  complement?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  entityId?: Maybe<Scalars['String']['output']>;
  geoCoordinates?: Maybe<Array<Maybe<Scalars['Float']['output']>>>;
  neighborhood?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  receiverName?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
  versionId?: Maybe<Scalars['String']['output']>;
};

export type UserOrderAssemblyOptions = {
  __typename?: 'UserOrderAssemblyOptions';
  Id?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
  Required?: Maybe<Scalars['Boolean']['output']>;
};

export type UserOrderAttachmentOfferings = {
  __typename?: 'UserOrderAttachmentOfferings';
  name?: Maybe<Scalars['String']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
};

export type UserOrderAttachments = {
  __typename?: 'UserOrderAttachments';
  content?: Maybe<Scalars['JSONObject']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type UserOrderBudget = {
  __typename?: 'UserOrderBudget';
  allocations?: Maybe<Array<Maybe<UserOrderBudgetAllocation>>>;
  balance?: Maybe<UserOrderBudgetBalance>;
  cycleConfiguration?: Maybe<UserOrderBudgetCycleConfiguration>;
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  unitId?: Maybe<Scalars['String']['output']>;
};

export type UserOrderBudgetAllocation = {
  __typename?: 'UserOrderBudgetAllocation';
  ToBeSpent?: Maybe<Scalars['Float']['output']>;
  balance?: Maybe<UserOrderBudgetBalance>;
  id?: Maybe<Scalars['String']['output']>;
  linkedEntity?: Maybe<UserOrderBudgetAllocationLinkedEntity>;
  reservations?: Maybe<Scalars['JSONObject']['output']>;
};

export type UserOrderBudgetAllocationLinkedEntity = {
  __typename?: 'UserOrderBudgetAllocationLinkedEntity';
  id?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type UserOrderBudgetBalance = {
  __typename?: 'UserOrderBudgetBalance';
  amount?: Maybe<Scalars['Float']['output']>;
  balanceAdjustment?: Maybe<Scalars['Float']['output']>;
  remaining?: Maybe<Scalars['Float']['output']>;
};

export type UserOrderBudgetCycleConfiguration = {
  __typename?: 'UserOrderBudgetCycleConfiguration';
  autoResetOnPeriodEnd?: Maybe<Scalars['Boolean']['output']>;
  carryOverBalance?: Maybe<Scalars['Boolean']['output']>;
  endDate?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['String']['output']>;
};

export type UserOrderBudgetData = {
  __typename?: 'UserOrderBudgetData';
  budgets?: Maybe<Array<Maybe<UserOrderBudget>>>;
};

export type UserOrderCancel = {
  __typename?: 'UserOrderCancel';
  data?: Maybe<Scalars['String']['output']>;
};

export type UserOrderCancellationData = {
  __typename?: 'UserOrderCancellationData';
  CancellationDate?: Maybe<Scalars['String']['output']>;
  Reason?: Maybe<Scalars['String']['output']>;
  RequestedByPaymentNotification?: Maybe<Scalars['Boolean']['output']>;
  RequestedBySellerNotification?: Maybe<Scalars['Boolean']['output']>;
  RequestedBySystem?: Maybe<Scalars['Boolean']['output']>;
  RequestedByUser?: Maybe<Scalars['Boolean']['output']>;
};

export type UserOrderCancellationRequest = {
  __typename?: 'UserOrderCancellationRequest';
  cancellationRequestDate?: Maybe<Scalars['String']['output']>;
  cancellationRequestDenyDate?: Maybe<Scalars['String']['output']>;
  deniedBySeller?: Maybe<Scalars['Boolean']['output']>;
  deniedBySellerReason?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  requestedByUser?: Maybe<Scalars['Boolean']['output']>;
};

export type UserOrderCategories = {
  __typename?: 'UserOrderCategories';
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type UserOrderClientPreferencesData = {
  __typename?: 'UserOrderClientPreferencesData';
  locale?: Maybe<Scalars['String']['output']>;
  optinNewsLetter?: Maybe<Scalars['Boolean']['output']>;
};

export type UserOrderClientProfileData = {
  __typename?: 'UserOrderClientProfileData';
  corporateDocument?: Maybe<Scalars['String']['output']>;
  corporateName?: Maybe<Scalars['String']['output']>;
  corporatePhone?: Maybe<Scalars['String']['output']>;
  customerClass?: Maybe<Scalars['String']['output']>;
  customerCode?: Maybe<Scalars['String']['output']>;
  document?: Maybe<Scalars['String']['output']>;
  documentType?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  isCorporate?: Maybe<Scalars['Boolean']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
  stateInscription?: Maybe<Scalars['String']['output']>;
  tradeName?: Maybe<Scalars['String']['output']>;
  userProfileId?: Maybe<Scalars['String']['output']>;
  userProfileVersion?: Maybe<Scalars['String']['output']>;
};

export type UserOrderContactInformation = {
  __typename?: 'UserOrderContactInformation';
  document?: Maybe<Scalars['String']['output']>;
  documentType?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
};

export type UserOrderCourierStatus = {
  __typename?: 'UserOrderCourierStatus';
  data?: Maybe<Array<UserOrderTrackingInformation>>;
  finished?: Maybe<Scalars['Boolean']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type UserOrderCurrencyFormatInfo = {
  __typename?: 'UserOrderCurrencyFormatInfo';
  CurrencyDecimalDigits?: Maybe<Scalars['Int']['output']>;
  CurrencyDecimalSeparator?: Maybe<Scalars['String']['output']>;
  CurrencyGroupSeparator?: Maybe<Scalars['String']['output']>;
  CurrencyGroupSize?: Maybe<Scalars['Int']['output']>;
  StartsWithCurrencySymbol?: Maybe<Scalars['Boolean']['output']>;
};

export type UserOrderCustomApp = {
  __typename?: 'UserOrderCustomApp';
  fields?: Maybe<UserOrderFields>;
  id?: Maybe<Scalars['String']['output']>;
  major?: Maybe<Scalars['Int']['output']>;
};

export type UserOrderCustomData = {
  __typename?: 'UserOrderCustomData';
  customApps?: Maybe<Array<Maybe<UserOrderCustomApp>>>;
  customFields?: Maybe<Array<Maybe<UserOrderCustomField>>>;
};

export type UserOrderCustomField = {
  __typename?: 'UserOrderCustomField';
  fields: Array<UserOrderCustomFieldField>;
  linkedEntity: UserOrderCustomFieldLinkedEntity;
};

export type UserOrderCustomFieldField = {
  __typename?: 'UserOrderCustomFieldField';
  name: Scalars['String']['output'];
  refId?: Maybe<Scalars['String']['output']>;
  value: Scalars['String']['output'];
};

export type UserOrderCustomFieldLinkedEntity = {
  __typename?: 'UserOrderCustomFieldLinkedEntity';
  id?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
};

export type UserOrderCustomFieldsGrouped = {
  __typename?: 'UserOrderCustomFieldsGrouped';
  fields?: Maybe<Array<Maybe<UserOrderCustomFieldField>>>;
  id?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
};

export type UserOrderDeliveryChannels = {
  __typename?: 'UserOrderDeliveryChannels';
  id?: Maybe<Scalars['String']['output']>;
  stockBalance?: Maybe<Scalars['Int']['output']>;
};

export type UserOrderDeliveryIds = {
  __typename?: 'UserOrderDeliveryIds';
  accountCarrierName?: Maybe<Scalars['String']['output']>;
  courierId?: Maybe<Scalars['String']['output']>;
  courierName?: Maybe<Scalars['String']['output']>;
  dockId?: Maybe<Scalars['String']['output']>;
  kitItemDetails?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  quantity?: Maybe<Scalars['Int']['output']>;
  warehouseId?: Maybe<Scalars['String']['output']>;
};

export type UserOrderDeliveryOption = {
  __typename?: 'UserOrderDeliveryOption';
  address?: Maybe<UserOrderAddress>;
  deliveryChannel?: Maybe<Scalars['String']['output']>;
  deliveryCompany?: Maybe<Scalars['String']['output']>;
  deliveryWindow?: Maybe<UserOrderDeliveryWindow>;
  friendlyDeliveryOptionName?: Maybe<Scalars['String']['output']>;
  friendlyShippingEstimate?: Maybe<Scalars['String']['output']>;
  items?: Maybe<Array<Maybe<UserOrderDeliveryOptionsItems>>>;
  pickupStoreInfo?: Maybe<UserOrderPickupStoreInfo>;
  quantityOfDifferentItems?: Maybe<Scalars['Int']['output']>;
  selectedSla?: Maybe<Scalars['String']['output']>;
  seller?: Maybe<Scalars['String']['output']>;
  shippingEstimate?: Maybe<Scalars['String']['output']>;
  shippingEstimateDate?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type UserOrderDeliveryOptionsContact = {
  __typename?: 'UserOrderDeliveryOptionsContact';
  email?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
};

export type UserOrderDeliveryOptionsData = {
  __typename?: 'UserOrderDeliveryOptionsData';
  contact?: Maybe<UserOrderDeliveryOptionsContact>;
  deliveryOptions?: Maybe<Array<Maybe<UserOrderDeliveryOption>>>;
};

export type UserOrderDeliveryOptionsItems = {
  __typename?: 'UserOrderDeliveryOptionsItems';
  id?: Maybe<Scalars['String']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  sellingPrice?: Maybe<Scalars['Float']['output']>;
  tax?: Maybe<Scalars['Float']['output']>;
  taxPriceTags?: Maybe<Array<Maybe<UserOrderPriceTag>>>;
  taxPriceTagsTotal?: Maybe<Scalars['Float']['output']>;
  total?: Maybe<Scalars['Float']['output']>;
  uniqueId?: Maybe<Scalars['String']['output']>;
};

export type UserOrderDeliveryWindow = {
  __typename?: 'UserOrderDeliveryWindow';
  endDateUtc?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  startDateUtc?: Maybe<Scalars['String']['output']>;
};

export type UserOrderDimension = {
  __typename?: 'UserOrderDimension';
  cubicweight?: Maybe<Scalars['Float']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  length?: Maybe<Scalars['Int']['output']>;
  weight?: Maybe<Scalars['Int']['output']>;
  width?: Maybe<Scalars['Int']['output']>;
};

export type UserOrderFields = {
  __typename?: 'UserOrderFields';
  cartEtag?: Maybe<Scalars['String']['output']>;
};

export type UserOrderFromList = {
  __typename?: 'UserOrderFromList';
  ShippingEstimatedDate?: Maybe<Scalars['String']['output']>;
  ShippingEstimatedDateMax?: Maybe<Scalars['String']['output']>;
  ShippingEstimatedDateMin?: Maybe<Scalars['String']['output']>;
  affiliateId?: Maybe<Scalars['String']['output']>;
  authorizedDate?: Maybe<Scalars['String']['output']>;
  callCenterOperatorName?: Maybe<Scalars['String']['output']>;
  clientName?: Maybe<Scalars['String']['output']>;
  creationDate?: Maybe<Scalars['String']['output']>;
  currencyCode?: Maybe<Scalars['String']['output']>;
  customFields?: Maybe<Array<Maybe<UserOrderFromListCustomFields>>>;
  deliveryDates?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  giftCardProviders?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  hostname?: Maybe<Scalars['String']['output']>;
  invoiceInput?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  invoiceOutput?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  isAllDelivered?: Maybe<Scalars['Boolean']['output']>;
  isAnyDelivered?: Maybe<Scalars['Boolean']['output']>;
  items?: Maybe<Array<Maybe<UserOrderItemsSummarized>>>;
  lastChange?: Maybe<Scalars['String']['output']>;
  lastMessageUnread?: Maybe<Scalars['String']['output']>;
  listId?: Maybe<Scalars['String']['output']>;
  listType?: Maybe<Scalars['String']['output']>;
  marketPlaceOrderId?: Maybe<Scalars['String']['output']>;
  orderFormId?: Maybe<Scalars['String']['output']>;
  orderId?: Maybe<Scalars['String']['output']>;
  orderIsComplete?: Maybe<Scalars['Boolean']['output']>;
  origin?: Maybe<Scalars['String']['output']>;
  paymentApprovedDate?: Maybe<Scalars['String']['output']>;
  paymentNames?: Maybe<Scalars['String']['output']>;
  readyForHandlingDate?: Maybe<Scalars['String']['output']>;
  salesChannel?: Maybe<Scalars['String']['output']>;
  sequence?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  statusDescription?: Maybe<Scalars['String']['output']>;
  totalItems?: Maybe<Scalars['Int']['output']>;
  totalValue?: Maybe<Scalars['Float']['output']>;
  workflowInErrorState?: Maybe<Scalars['Boolean']['output']>;
  workflowInRetry?: Maybe<Scalars['Boolean']['output']>;
};

export type UserOrderFromListCustomFields = {
  __typename?: 'UserOrderFromListCustomFields';
  type?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type UserOrderFromListMinimal = {
  __typename?: 'UserOrderFromListMinimal';
  ShippingEstimatedDate?: Maybe<Scalars['String']['output']>;
  clientName?: Maybe<Scalars['String']['output']>;
  creationDate?: Maybe<Scalars['String']['output']>;
  currencyCode?: Maybe<Scalars['String']['output']>;
  customFields?: Maybe<Array<Maybe<UserOrderFromListCustomFields>>>;
  items?: Maybe<Array<Maybe<UserOrderItemsSummarized>>>;
  orderId?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  statusDescription?: Maybe<Scalars['String']['output']>;
  totalValue?: Maybe<Scalars['Float']['output']>;
};

export const enum UserOrderInvoiceType {
  Input = 'Input',
  Output = 'Output'
};

export type UserOrderItemAttachment = {
  __typename?: 'UserOrderItemAttachment';
  name?: Maybe<Scalars['String']['output']>;
};

export type UserOrderItemMetadata = {
  __typename?: 'UserOrderItemMetadata';
  Items?: Maybe<Array<Maybe<UserOrderItemMetadataItem>>>;
};

export type UserOrderItemMetadataItem = {
  __typename?: 'UserOrderItemMetadataItem';
  AssemblyOptions?: Maybe<Array<Maybe<UserOrderAssemblyOptions>>>;
  DetailUrl?: Maybe<Scalars['String']['output']>;
  Ean?: Maybe<Scalars['String']['output']>;
  Id?: Maybe<Scalars['String']['output']>;
  ImageUrl?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
  ProductId?: Maybe<Scalars['String']['output']>;
  RefId?: Maybe<Scalars['String']['output']>;
  Seller?: Maybe<Scalars['String']['output']>;
  SkuName?: Maybe<Scalars['String']['output']>;
};

export type UserOrderItems = {
  __typename?: 'UserOrderItems';
  additionalInfo?: Maybe<UserOrderAdditionalInfo>;
  assemblies?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  attachmentOfferings?: Maybe<Array<Maybe<UserOrderAttachmentOfferings>>>;
  attachments?: Maybe<Array<Maybe<UserOrderAttachments>>>;
  bundleItems?: Maybe<Array<Maybe<UserOrderItems>>>;
  callCenterOperator?: Maybe<Scalars['String']['output']>;
  commission?: Maybe<Scalars['Float']['output']>;
  components?: Maybe<Array<Maybe<UserOrderItems>>>;
  costPrice?: Maybe<Scalars['Float']['output']>;
  detailUrl?: Maybe<Scalars['String']['output']>;
  ean?: Maybe<Scalars['String']['output']>;
  freightCommission?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  isGift?: Maybe<Scalars['Boolean']['output']>;
  itemAttachment?: Maybe<UserOrderItemAttachment>;
  listPrice?: Maybe<Scalars['Float']['output']>;
  lockId?: Maybe<Scalars['String']['output']>;
  manualPrice?: Maybe<Scalars['String']['output']>;
  manualPriceAppliedBy?: Maybe<Scalars['String']['output']>;
  measurementUnit?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  offerings?: Maybe<Array<Maybe<UserOrderOfferings>>>;
  params?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  parentAssemblyBinding?: Maybe<Scalars['String']['output']>;
  parentItemIndex?: Maybe<Scalars['String']['output']>;
  preSaleDate?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  priceDefinition?: Maybe<UserOrderPriceDefinition>;
  priceTags?: Maybe<Array<Maybe<UserOrderPriceTag>>>;
  priceValidUntil?: Maybe<Scalars['String']['output']>;
  productId?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  refId?: Maybe<Scalars['String']['output']>;
  rewardValue?: Maybe<Scalars['Float']['output']>;
  seller?: Maybe<Scalars['String']['output']>;
  sellerSku?: Maybe<Scalars['String']['output']>;
  sellingPrice?: Maybe<Scalars['Float']['output']>;
  serialNumbers?: Maybe<Scalars['String']['output']>;
  shippingPrice?: Maybe<Scalars['String']['output']>;
  tax?: Maybe<Scalars['Float']['output']>;
  taxCode?: Maybe<Scalars['String']['output']>;
  uniqueId?: Maybe<Scalars['String']['output']>;
  unitMultiplier?: Maybe<Scalars['Float']['output']>;
};

export type UserOrderItemsSummarized = {
  __typename?: 'UserOrderItemsSummarized';
  description?: Maybe<Scalars['String']['output']>;
  ean?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  productId?: Maybe<Scalars['String']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  refId?: Maybe<Scalars['String']['output']>;
  seller?: Maybe<Scalars['String']['output']>;
  sellingPrice?: Maybe<Scalars['Float']['output']>;
};

export type UserOrderListMinimalResult = {
  __typename?: 'UserOrderListMinimalResult';
  list?: Maybe<Array<Maybe<UserOrderFromListMinimal>>>;
  paging?: Maybe<UserOrderListPaging>;
};

export type UserOrderListPaging = {
  __typename?: 'UserOrderListPaging';
  currentPage?: Maybe<Scalars['Int']['output']>;
  pages?: Maybe<Scalars['Int']['output']>;
  perPage?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
};

export type UserOrderListResult = {
  __typename?: 'UserOrderListResult';
  facets?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  list?: Maybe<Array<UserOrderFromList>>;
  paging?: Maybe<UserOrderListPaging>;
  reportRecordsLimit?: Maybe<Scalars['Int']['output']>;
  stats?: Maybe<UserOrderListStats>;
};

export type UserOrderListStats = {
  __typename?: 'UserOrderListStats';
  stats?: Maybe<UserOrderListStatsData>;
};

export type UserOrderListStatsData = {
  __typename?: 'UserOrderListStatsData';
  totalItems?: Maybe<UserOrderListStatsValue>;
  totalValue?: Maybe<UserOrderListStatsValue>;
};

export type UserOrderListStatsValue = {
  __typename?: 'UserOrderListStatsValue';
  Count?: Maybe<Scalars['Int']['output']>;
  Facets?: Maybe<Scalars['JSONObject']['output']>;
  Max?: Maybe<Scalars['Float']['output']>;
  Mean?: Maybe<Scalars['Float']['output']>;
  Min?: Maybe<Scalars['Float']['output']>;
  Missing?: Maybe<Scalars['Int']['output']>;
  StdDev?: Maybe<Scalars['Float']['output']>;
  Sum?: Maybe<Scalars['Float']['output']>;
  SumOfSquares?: Maybe<Scalars['Float']['output']>;
};

export type UserOrderLogisticsInfo = {
  __typename?: 'UserOrderLogisticsInfo';
  addressId?: Maybe<Scalars['String']['output']>;
  deliveryChannel?: Maybe<Scalars['String']['output']>;
  deliveryChannels?: Maybe<Array<Maybe<UserOrderDeliveryChannels>>>;
  deliveryCompany?: Maybe<Scalars['String']['output']>;
  deliveryIds?: Maybe<Array<Maybe<UserOrderDeliveryIds>>>;
  deliveryWindow?: Maybe<UserOrderDeliveryWindow>;
  entityId?: Maybe<Scalars['String']['output']>;
  itemId?: Maybe<Scalars['String']['output']>;
  itemIndex?: Maybe<Scalars['Int']['output']>;
  listPrice?: Maybe<Scalars['Float']['output']>;
  lockTTL?: Maybe<Scalars['String']['output']>;
  pickupPointId?: Maybe<Scalars['String']['output']>;
  pickupStoreInfo?: Maybe<UserOrderPickupStoreInfo>;
  polygonName?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  selectedDeliveryChannel?: Maybe<Scalars['String']['output']>;
  selectedSla?: Maybe<Scalars['String']['output']>;
  sellingPrice?: Maybe<Scalars['Float']['output']>;
  shippingEstimate?: Maybe<Scalars['String']['output']>;
  shippingEstimateDate?: Maybe<Scalars['String']['output']>;
  shipsTo?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  slas?: Maybe<Array<Maybe<UserOrderSlas>>>;
  transitTime?: Maybe<Scalars['String']['output']>;
  versionId?: Maybe<Scalars['String']['output']>;
};

export type UserOrderMarketplace = {
  __typename?: 'UserOrderMarketplace';
  baseURL?: Maybe<Scalars['String']['output']>;
  isCertified?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type UserOrderOfferings = {
  __typename?: 'UserOrderOfferings';
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type UserOrderPackage = {
  __typename?: 'UserOrderPackage';
  courier?: Maybe<Scalars['String']['output']>;
  courierStatus?: Maybe<UserOrderCourierStatus>;
  extraValue?: Maybe<Scalars['Float']['output']>;
  invoiceKey?: Maybe<Scalars['String']['output']>;
  invoiceNumber: Scalars['String']['output'];
  invoiceUrl?: Maybe<Scalars['String']['output']>;
  invoiceValue: Scalars['Float']['output'];
  issuanceDate?: Maybe<Scalars['String']['output']>;
  items?: Maybe<Array<UserOrderPackageItem>>;
  restitutions?: Maybe<UserOrderRestitutions>;
  trackingNumber?: Maybe<Scalars['String']['output']>;
  trackingUrl?: Maybe<Scalars['String']['output']>;
  type?: Maybe<UserOrderInvoiceType>;
};

export type UserOrderPackageAttachment = {
  __typename?: 'UserOrderPackageAttachment';
  packages?: Maybe<Array<Maybe<UserOrderPackage>>>;
};

export type UserOrderPackageItem = {
  __typename?: 'UserOrderPackageItem';
  description?: Maybe<Scalars['String']['output']>;
  itemIndex?: Maybe<Scalars['Int']['output']>;
  price?: Maybe<Scalars['Int']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
};

export type UserOrderPaymentConnectorResponses = {
  __typename?: 'UserOrderPaymentConnectorResponses';
  Message?: Maybe<Scalars['String']['output']>;
  ReturnCode?: Maybe<Scalars['String']['output']>;
  Tid?: Maybe<Scalars['String']['output']>;
  authId?: Maybe<Scalars['String']['output']>;
};

export type UserOrderPaymentData = {
  __typename?: 'UserOrderPaymentData';
  giftCards?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  transactions?: Maybe<Array<Maybe<UserOrderTransactions>>>;
};

export type UserOrderPayments = {
  __typename?: 'UserOrderPayments';
  accountId?: Maybe<Scalars['String']['output']>;
  bankIssuedInvoiceBarCodeNumber?: Maybe<Scalars['String']['output']>;
  bankIssuedInvoiceBarCodeType?: Maybe<Scalars['String']['output']>;
  bankIssuedInvoiceIdentificationNumber?: Maybe<Scalars['String']['output']>;
  bankIssuedInvoiceIdentificationNumberFormatted?: Maybe<Scalars['String']['output']>;
  billingAddress?: Maybe<Scalars['String']['output']>;
  cardHolder?: Maybe<Scalars['String']['output']>;
  cardNumber?: Maybe<Scalars['String']['output']>;
  connectorResponses?: Maybe<UserOrderPaymentConnectorResponses>;
  cvv2?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['String']['output']>;
  expireMonth?: Maybe<Scalars['String']['output']>;
  expireYear?: Maybe<Scalars['String']['output']>;
  firstDigits?: Maybe<Scalars['String']['output']>;
  giftCardAsDiscount?: Maybe<Scalars['String']['output']>;
  giftCardCaption?: Maybe<Scalars['String']['output']>;
  giftCardId?: Maybe<Scalars['String']['output']>;
  giftCardName?: Maybe<Scalars['String']['output']>;
  giftCardProvider?: Maybe<Scalars['String']['output']>;
  group?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  installments?: Maybe<Scalars['Int']['output']>;
  koinUrl?: Maybe<Scalars['String']['output']>;
  lastDigits?: Maybe<Scalars['String']['output']>;
  parentAccountId?: Maybe<Scalars['String']['output']>;
  paymentOrigin?: Maybe<Scalars['String']['output']>;
  paymentSystem?: Maybe<Scalars['String']['output']>;
  paymentSystemName?: Maybe<Scalars['String']['output']>;
  redemptionCode?: Maybe<Scalars['String']['output']>;
  referenceValue?: Maybe<Scalars['Int']['output']>;
  tid?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Int']['output']>;
};

export type UserOrderPickupStoreInfo = {
  __typename?: 'UserOrderPickupStoreInfo';
  additionalInfo?: Maybe<Scalars['String']['output']>;
  address?: Maybe<UserOrderAddress>;
  dockId?: Maybe<Scalars['String']['output']>;
  friendlyName?: Maybe<Scalars['String']['output']>;
  isPickupStore?: Maybe<Scalars['Boolean']['output']>;
};

export type UserOrderPriceDefinition = {
  __typename?: 'UserOrderPriceDefinition';
  calculatedSellingPrice?: Maybe<Scalars['Float']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  sellingPrices?: Maybe<Array<Maybe<UserOrderSellingPrices>>>;
  total?: Maybe<Scalars['Float']['output']>;
};

export type UserOrderPriceTag = {
  __typename?: 'UserOrderPriceTag';
  identifier?: Maybe<Scalars['String']['output']>;
  isPercentual?: Maybe<Scalars['Boolean']['output']>;
  jurisCode?: Maybe<Scalars['String']['output']>;
  jurisName?: Maybe<Scalars['String']['output']>;
  jurisType?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  owner?: Maybe<Scalars['String']['output']>;
  rate?: Maybe<Scalars['Float']['output']>;
  rawValue: Scalars['Float']['output'];
  value?: Maybe<Scalars['Float']['output']>;
};

export type UserOrderPurchaseAgent = {
  __typename?: 'UserOrderPurchaseAgent';
  persona?: Maybe<Scalars['String']['output']>;
  unitId?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['String']['output']>;
  versionId?: Maybe<Scalars['String']['output']>;
};

export type UserOrderPurchaseAgentData = {
  __typename?: 'UserOrderPurchaseAgentData';
  purchaseAgents?: Maybe<Array<Maybe<UserOrderPurchaseAgent>>>;
};

export type UserOrderRateAndBenefitsIdentifier = {
  __typename?: 'UserOrderRateAndBenefitsIdentifier';
  additionalInfo?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  featured?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type UserOrderRatesAndBenefitsData = {
  __typename?: 'UserOrderRatesAndBenefitsData';
  id?: Maybe<Scalars['String']['output']>;
  rateAndBenefitsIdentifiers?: Maybe<Array<Maybe<UserOrderRateAndBenefitsIdentifier>>>;
};

export type UserOrderRestitutionItem = {
  __typename?: 'UserOrderRestitutionItem';
  compensationValue?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  isCompensation?: Maybe<Scalars['Boolean']['output']>;
  itemIndex?: Maybe<Scalars['Int']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  unitMultiplier?: Maybe<Scalars['Float']['output']>;
  useFreight?: Maybe<Scalars['Boolean']['output']>;
};

export type UserOrderRestitutionOption = {
  __typename?: 'UserOrderRestitutionOption';
  items?: Maybe<Array<UserOrderRestitutionItem>>;
  value?: Maybe<Scalars['Float']['output']>;
};

export type UserOrderRestitutions = {
  __typename?: 'UserOrderRestitutions';
  GiftCard?: Maybe<UserOrderRestitutionOption>;
  Refund?: Maybe<UserOrderRestitutionOption>;
};

export type UserOrderResult = {
  __typename?: 'UserOrderResult';
  allowCancellation?: Maybe<Scalars['Boolean']['output']>;
  budgetData?: Maybe<UserOrderBudgetData>;
  canProcessOrderAuthorization?: Maybe<Scalars['Boolean']['output']>;
  clientProfileData?: Maybe<UserOrderClientProfileData>;
  creationDate?: Maybe<Scalars['String']['output']>;
  customData?: Maybe<UserOrderCustomData>;
  customFields?: Maybe<Array<Maybe<UserOrderCustomFieldsGrouped>>>;
  deliveryOptionsData?: Maybe<UserOrderDeliveryOptionsData>;
  items?: Maybe<Array<Maybe<UserOrderItems>>>;
  orderId?: Maybe<Scalars['String']['output']>;
  paymentData?: Maybe<UserOrderPaymentData>;
  ruleForAuthorization?: Maybe<ProcessOrderAuthorizationRule>;
  shippingData?: Maybe<UserOrderShippingData>;
  shopper?: Maybe<UserOrderShopper>;
  status?: Maybe<Scalars['String']['output']>;
  statusDescription?: Maybe<Scalars['String']['output']>;
  storePreferencesData?: Maybe<UserOrderStorePreferencesData>;
  totals?: Maybe<Array<Maybe<UserOrderTotals>>>;
};

export type UserOrderSellingPrices = {
  __typename?: 'UserOrderSellingPrices';
  quantity?: Maybe<Scalars['Int']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
};

export type UserOrderShippingData = {
  __typename?: 'UserOrderShippingData';
  address?: Maybe<UserOrderAddress>;
  availableAddresses?: Maybe<Array<Maybe<UserOrderAddress>>>;
  contactInformation?: Maybe<Array<Maybe<UserOrderContactInformation>>>;
  id?: Maybe<Scalars['String']['output']>;
  logisticsInfo?: Maybe<Array<Maybe<UserOrderLogisticsInfo>>>;
  selectedAddresses?: Maybe<Array<Maybe<UserOrderAddress>>>;
  trackingHints?: Maybe<Scalars['String']['output']>;
};

export type UserOrderShopper = {
  __typename?: 'UserOrderShopper';
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  phone?: Maybe<Scalars['String']['output']>;
};

export type UserOrderSlas = {
  __typename?: 'UserOrderSlas';
  availableDeliveryWindows?: Maybe<Array<Maybe<UserOrderDeliveryWindow>>>;
  deliveryChannel?: Maybe<Scalars['String']['output']>;
  deliveryIds?: Maybe<Array<Maybe<UserOrderDeliveryIds>>>;
  deliveryWindow?: Maybe<UserOrderDeliveryWindow>;
  id?: Maybe<Scalars['String']['output']>;
  listPrice?: Maybe<Scalars['Float']['output']>;
  lockTTL?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  pickupDistance?: Maybe<Scalars['Int']['output']>;
  pickupPointId?: Maybe<Scalars['String']['output']>;
  pickupStoreInfo?: Maybe<UserOrderPickupStoreInfo>;
  polygonName?: Maybe<Scalars['String']['output']>;
  price?: Maybe<Scalars['Float']['output']>;
  shippingEstimate?: Maybe<Scalars['String']['output']>;
  shippingEstimateDate?: Maybe<Scalars['String']['output']>;
  transitTime?: Maybe<Scalars['String']['output']>;
};

export type UserOrderStorePreferencesData = {
  __typename?: 'UserOrderStorePreferencesData';
  countryCode?: Maybe<Scalars['String']['output']>;
  currencyCode?: Maybe<Scalars['String']['output']>;
  currencyFormatInfo?: Maybe<UserOrderCurrencyFormatInfo>;
  currencyLocale?: Maybe<Scalars['Int']['output']>;
  currencySymbol?: Maybe<Scalars['String']['output']>;
  timeZone?: Maybe<Scalars['String']['output']>;
};

export type UserOrderStoreSellers = {
  __typename?: 'UserOrderStoreSellers';
  fulfillmentEndpoint?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type UserOrderTotals = {
  __typename?: 'UserOrderTotals';
  id?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
};

export type UserOrderTrackingInformation = {
  __typename?: 'UserOrderTrackingInformation';
  city?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  lastChange?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
};

export type UserOrderTransactions = {
  __typename?: 'UserOrderTransactions';
  isActive?: Maybe<Scalars['Boolean']['output']>;
  merchantName?: Maybe<Scalars['String']['output']>;
  payments?: Maybe<Array<Maybe<UserOrderPayments>>>;
  transactionId?: Maybe<Scalars['String']['output']>;
};

export type ValidateUserData = {
  __typename?: 'ValidateUserData';
  /** Indicates if the user is valid. */
  isValid: Scalars['Boolean']['output'];
};
