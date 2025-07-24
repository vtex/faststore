export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * Example:
   *
   * ```json
   * {
   *   Color: 'Red', Size: '42'
   * }
   * ```
   */
  ActiveVariations: any;
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
  FormattedVariants: any;
  JSONObject: any;
  ObjectOrString: any;
  /**
   * Example:
   *
   * ```json
   * {
   *   'Color-Red-Size-40': 'classic-shoes-37'
   * }
   * ```
   */
  SlugsMap: any;
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
  VariantsByName: any;
};

/** Address information. */
export type Address = {
  __typename?: 'Address';
  /** Address city */
  city?: Maybe<Scalars['String']>;
  /** Address complement */
  complement?: Maybe<Scalars['String']>;
  /** Address country */
  country?: Maybe<Scalars['String']>;
  /** Address geoCoordinates */
  geoCoordinates?: Maybe<Array<Maybe<Scalars['Float']>>>;
  /** Address neighborhood */
  neighborhood?: Maybe<Scalars['String']>;
  /** Address number */
  number?: Maybe<Scalars['String']>;
  /** Address postal code */
  postalCode?: Maybe<Scalars['String']>;
  /** Address reference */
  reference?: Maybe<Scalars['String']>;
  /** Address state */
  state?: Maybe<Scalars['String']>;
  /** Address street */
  street?: Maybe<Scalars['String']>;
};

/** Advertisement information about a specific product in a campaign */
export type Advertisement = {
  __typename?: 'Advertisement';
  /** Cost of the action, usually Cost Per Click. */
  actionCost: Scalars['Float'];
  /** Advertiser ID of the product. */
  adId: Scalars['String'];
  /** Advertiser Request ID. */
  adRequestId: Scalars['String'];
  /** Advertiser Response ID. */
  adResponseId: Scalars['String'];
  /** Campaign ID. */
  campaignId: Scalars['String'];
};

export type AvailableDeliveryWindows = {
  __typename?: 'AvailableDeliveryWindows';
  /** Available delivery window end date in UTC */
  endDateUtc?: Maybe<Scalars['String']>;
  /** Available delivery window list price */
  listPrice?: Maybe<Scalars['Int']>;
  /** Available delivery window price */
  price?: Maybe<Scalars['Int']>;
  /** Available delivery window start date in UTC */
  startDateUtc?: Maybe<Scalars['String']>;
  /** Available delivery window tax */
  tax?: Maybe<Scalars['Int']>;
};

export type BusinessHour = {
  __typename?: 'BusinessHour';
  /** Business hour closing time. */
  closingTime?: Maybe<Scalars['String']>;
  /** Number that represents the day of the week. */
  dayOfWeek?: Maybe<Scalars['Int']>;
  /** Business hour opening time. */
  openingTime?: Maybe<Scalars['String']>;
};

/** Commercial Authorization dimension status. */
export type CommercialAuthorizationDimensionStatus = {
  __typename?: 'CommercialAuthorizationDimensionStatus';
  /** Creation date. */
  creationDate: Scalars['String'];
  /** Creation environment. */
  creationEnvironment: Scalars['String'];
  /** Creation version. */
  creationVersion: Scalars['String'];
  /** Dimension status ID. */
  id: Scalars['String'];
  /** Dimension status name. */
  name: Scalars['String'];
  /** Priority level. */
  priority: Scalars['Int'];
  /** Indicates if all rules acceptance is required. */
  requireAllRulesAcceptance: Scalars['Boolean'];
  /** Collection of rules for this dimension. */
  ruleCollection: Array<CommercialAuthorizationRule>;
  /** Dimension score. */
  score: Scalars['Float'];
  /** Indicates if simulation should be performed. */
  shouldSimulate: Scalars['Boolean'];
  /** Current status of the dimension. */
  status: CommercialAuthorizationStatus;
  /** Unit ID, if applicable. */
  unitId?: Maybe<Scalars['String']>;
};

/** Commercial Authorization item. */
export type CommercialAuthorizationItem = {
  __typename?: 'CommercialAuthorizationItem';
  /** Additional information as key-value pairs. */
  additionalInfo: Scalars['JSONObject'];
  /** Item ID. */
  id: Scalars['String'];
  /** Item price. */
  price: Scalars['Float'];
  /** Item quantity. */
  quantity: Scalars['Int'];
  /** Item SKU. */
  sku: Scalars['String'];
  /** Total manual discount applied. */
  totalManualDiscount: Scalars['Float'];
  /** Total system discount applied. */
  totalSystemDiscount: Scalars['Float'];
};

/** Commercial Authorization response. */
export type CommercialAuthorizationResponse = {
  __typename?: 'CommercialAuthorizationResponse';
  /** Additional information as key-value pairs. */
  additionalInfo: Scalars['JSONObject'];
  /** Callback endpoint URL. */
  callbackEndpoint: Scalars['String'];
  /** Creation environment. */
  creationEnvironment: Scalars['String'];
  /** Creation version. */
  creationVersion: Scalars['String'];
  /** Dimension status information. */
  dimensionStatus: Array<CommercialAuthorizationDimensionStatus>;
  /** Commercial Authorization ID. */
  id: Scalars['String'];
  /** Collection of items in the commercial authorization. */
  itemCollection: Array<CommercialAuthorizationItem>;
  /** Marketplace payment value. */
  marketPlacePaymentValue: Scalars['Float'];
  /** Order ID associated with the commercial authorization. */
  orderId: Scalars['String'];
  /** Current status of the commercial authorization. */
  status: CommercialAuthorizationStatus;
  /** Total order value desired by the seller. */
  totalOrderValueDesiredBySeller: Scalars['Float'];
  /** List of units. */
  units: Array<Scalars['String']>;
  /** User profile ID. */
  userProfileId: Scalars['String'];
  /** Workflow instance ID. */
  workflowInstanceId: Scalars['String'];
};

/** Commercial Authorization rule. */
export type CommercialAuthorizationRule = {
  __typename?: 'CommercialAuthorizationRule';
  /** Authorization data, if available. */
  authorizationData?: Maybe<CommercialAuthorizationRuleAuthorizationData>;
  /** List of authorized email addresses. */
  authorizedEmails: Array<Scalars['String']>;
  /** DO ID, if applicable. */
  doId?: Maybe<Scalars['String']>;
  /** Rule ID. */
  id: Scalars['String'];
  /**
   * Indicates that the user is listed as one of the possible approvers,
   * but does not necessarily mean that he or she is the next in the chain to approve.
   */
  isUserAuthorized: Scalars['Boolean'];
  /**
   * Indicates that the user is next in the approval chain.
   * This means that they must take an approval or rejection action.
   */
  isUserNextAuthorizer: Scalars['Boolean'];
  /** Rule name. */
  name: Scalars['String'];
  /** Indicates if notification is enabled. */
  notification: Scalars['Boolean'];
  /** Rule priority. */
  priority: Scalars['Int'];
  /** Score interval configuration. */
  scoreInterval: CommercialAuthorizationRuleScoreInterval;
  /** Current status of the rule. */
  status: CommercialAuthorizationStatus;
  /** Timeout value. */
  timeout: Scalars['Int'];
  /** Rule trigger configuration. */
  trigger: CommercialAuthorizationRuleTrigger;
};

/** Commercial Authorization rule authorization data. */
export type CommercialAuthorizationRuleAuthorizationData = {
  __typename?: 'CommercialAuthorizationRuleAuthorizationData';
  /** List of authorizers. */
  authorizers: Array<CommercialAuthorizationRuleAuthorizer>;
  /** Indicates if all approvals are required. */
  requireAllApprovals: Scalars['Boolean'];
};

/** Commercial Authorization rule authorizer. */
export type CommercialAuthorizationRuleAuthorizer = {
  __typename?: 'CommercialAuthorizationRuleAuthorizer';
  /** Authorization date. */
  authorizationDate?: Maybe<Scalars['String']>;
  /** Authorizer email. */
  email?: Maybe<Scalars['String']>;
  /** Authorizer ID. */
  id: Scalars['String'];
  /** Authorizer type. */
  type: Scalars['String'];
};

/** Commercial Authorization rule score interval. */
export type CommercialAuthorizationRuleScoreInterval = {
  __typename?: 'CommercialAuthorizationRuleScoreInterval';
  /** Accept score threshold. */
  accept: Scalars['Float'];
  /** Deny score threshold. */
  deny: Scalars['Float'];
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
  conditionType: Scalars['Int'];
  /** Condition description. */
  description?: Maybe<Scalars['String']>;
  /** Condition expression. */
  expression?: Maybe<Scalars['String']>;
  /** Greater than value. */
  greatherThan?: Maybe<Scalars['Float']>;
  /** Less than value. */
  lessThan?: Maybe<Scalars['Float']>;
};

/** Commercial Authorization rule trigger effect. */
export type CommercialAuthorizationRuleTriggerEffect = {
  __typename?: 'CommercialAuthorizationRuleTriggerEffect';
  /** Effect description. */
  description?: Maybe<Scalars['String']>;
  /** Effect type. */
  effectType: Scalars['Int'];
  /** Function path. */
  funcPath?: Maybe<Scalars['String']>;
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
  courierId?: Maybe<Scalars['String']>;
  /** DeliveryIds courier name */
  courierName?: Maybe<Scalars['String']>;
  /** DeliveryIds dock id */
  dockId?: Maybe<Scalars['String']>;
  /** DeliveryIds quantity */
  quantity?: Maybe<Scalars['Int']>;
  /** DeliveryIds warehouse id */
  warehouseId?: Maybe<Scalars['String']>;
};

/** Input to get commercial authorizations by order ID. */
export type ICommercialAuthorizationByOrderId = {
  /** Order ID to get commercial authorizations for. */
  orderId: Scalars['String'];
};

export type IGeoCoordinates = {
  /** The latitude of the geographic coordinates. */
  latitude: Scalars['Float'];
  /** The longitude of the geographic coordinates. */
  longitude: Scalars['Float'];
};

/** Person data input to the newsletter. */
export type IPersonNewsletter = {
  /** Person's email. */
  email: Scalars['String'];
  /** Person's name. */
  name: Scalars['String'];
};

/** Input to process order authorization (approve or reject). */
export type IProcessOrderAuthorization = {
  /** Whether the authorization is approved (true) or rejected (false). */
  approved: Scalars['Boolean'];
  /** Dimension ID associated with the authorization. */
  dimensionId: Scalars['String'];
  /** Order authorization ID. */
  orderAuthorizationId: Scalars['String'];
  /** Rule ID associated with the authorization. */
  ruleId: Scalars['String'];
};

/** Input type for setting a new password. */
export type ISetPassword = {
  /** Optional access key for the user, used in some authentication flows. */
  accesskey?: Maybe<Scalars['String']>;
  /** The current password of the user, required for verification before changing to the new password. */
  currentPassword: Scalars['String'];
  /** The email of the user for whom the password is being set. */
  email: Scalars['String'];
  /** The new password to be set for the user. */
  newPassword: Scalars['String'];
  /** Optional reCAPTCHA token for security verification. */
  recaptcha?: Maybe<Scalars['String']>;
};

/** Shipping Simulation item input. */
export type IShippingItem = {
  /** ShippingItem ID / Sku. */
  id: Scalars['String'];
  /** Number of items. */
  quantity: Scalars['Int'];
  /** Seller responsible for the ShippingItem. */
  seller: Scalars['String'];
};

export type IStoreB2B = {
  customerId: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  isRepresentative?: Maybe<Scalars['Boolean']>;
  lastName?: Maybe<Scalars['String']>;
  savedPostalCode?: Maybe<Scalars['String']>;
  unitId?: Maybe<Scalars['String']>;
  unitName?: Maybe<Scalars['String']>;
  userEmail?: Maybe<Scalars['String']>;
  userName?: Maybe<Scalars['String']>;
};

/** Shopping cart input. */
export type IStoreCart = {
  /** Order information, including `orderNumber`, `acceptedOffer` and `shouldSplitItem`. */
  order: IStoreOrder;
};

export type IStoreCurrency = {
  /** Currency code (e.g: USD). */
  code: Scalars['String'];
  /** Currency symbol (e.g: $). */
  symbol: Scalars['String'];
};

export type IStoreDeliveryMode = {
  /** The delivery channel information of the session. */
  deliveryChannel: Scalars['String'];
  /** The delivery method information of the session. */
  deliveryMethod: Scalars['String'];
  /** The delivery window information of the session. */
  deliveryWindow?: Maybe<IStoreDeliveryWindow>;
};

/** Delivery window information. */
export type IStoreDeliveryWindow = {
  /** The delivery window end date information. */
  endDate: Scalars['String'];
  /** The delivery window start date information. */
  startDate: Scalars['String'];
};

export type IStoreGeoCoordinates = {
  /** The latitude of the geographic coordinates. */
  latitude: Scalars['Float'];
  /** The longitude of the geographic coordinates. */
  longitude: Scalars['Float'];
};

/** Image input. */
export type IStoreImage = {
  /** Alias for the input image. */
  alternateName: Scalars['String'];
  /** Image input URL. */
  url: Scalars['String'];
};

export type IStoreMarketingData = {
  utmCampaign?: Maybe<Scalars['String']>;
  utmMedium?: Maybe<Scalars['String']>;
  utmSource?: Maybe<Scalars['String']>;
  utmiCampaign?: Maybe<Scalars['String']>;
  utmiPage?: Maybe<Scalars['String']>;
  utmiPart?: Maybe<Scalars['String']>;
};

/** Offer input. */
export type IStoreOffer = {
  /** Information on the item being offered. */
  itemOffered: IStoreProduct;
  /** This is displayed as the "from" price in the context of promotions' price comparison. This may change before it reaches the shelf. */
  listPrice: Scalars['Float'];
  /** Also known as spot price. */
  price: Scalars['Float'];
  /** Number of items offered. */
  quantity: Scalars['Int'];
  /** Seller responsible for the offer. */
  seller: IStoreOrganization;
};

/** Order input. */
export type IStoreOrder = {
  /** Array with information on each accepted offer. */
  acceptedOffer: Array<IStoreOffer>;
  /** ID of the order in [VTEX order management](https://help.vtex.com/en/tutorial/license-manager-resources-oms--60QcBsvWeum02cFi3GjBzg#). */
  orderNumber: Scalars['String'];
  /** Indicates whether or not items with attachments should be split. */
  shouldSplitItem?: Maybe<Scalars['Boolean']>;
};

/** Organization input. */
export type IStoreOrganization = {
  /** Organization ID. */
  identifier: Scalars['String'];
};

/** Client profile data. */
export type IStorePerson = {
  /** Client email. */
  email: Scalars['String'];
  /** Client last name. */
  familyName: Scalars['String'];
  /** Client first name. */
  givenName: Scalars['String'];
  /** Client ID. */
  id: Scalars['String'];
};

/** Product input. Products are variants within product groups, equivalent to VTEX [SKUs](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). For example, you may have a **Shirt** product group with associated products such as **Blue shirt size L**, **Green shirt size XL** and so on. */
export type IStoreProduct = {
  /** Custom Product Additional Properties. */
  additionalProperty?: Maybe<Array<IStorePropertyValue>>;
  /** Array of product images. */
  image: Array<IStoreImage>;
  /** Product name. */
  name: Scalars['String'];
  /** Stock Keeping Unit. Merchant-specific ID for the product. */
  sku: Scalars['String'];
};

export type IStorePropertyValue = {
  /** Property name. */
  name: Scalars['String'];
  /** Property id. This propert changes according to the content of the object. */
  propertyID?: Maybe<Scalars['String']>;
  /** Property value. May hold a string or the string representation of an object. */
  value: Scalars['ObjectOrString'];
  /** Specifies the nature of the value */
  valueReference: Scalars['ObjectOrString'];
};

/** Selected search facet input. */
export type IStoreSelectedFacet = {
  /** Selected search facet key. */
  key: Scalars['String'];
  /** Selected search facet value. */
  value: Scalars['String'];
};

/** Session input. */
export type IStoreSession = {
  /** Session input address type. */
  addressType?: Maybe<Scalars['String']>;
  /** Session input b2b. */
  b2b?: Maybe<IStoreB2B>;
  /** Session input channel. */
  channel?: Maybe<Scalars['String']>;
  /** Session input city. */
  city?: Maybe<Scalars['String']>;
  /** Session input country. */
  country: Scalars['String'];
  /** Session input currency. */
  currency: IStoreCurrency;
  /** Session input delivery mode. */
  deliveryMode?: Maybe<IStoreDeliveryMode>;
  /** Session input geoCoordinates. */
  geoCoordinates?: Maybe<IStoreGeoCoordinates>;
  /** Session input locale. */
  locale: Scalars['String'];
  /** Marketing information input. */
  marketingData?: Maybe<IStoreMarketingData>;
  /** Session input person. */
  person?: Maybe<IStorePerson>;
  /** Session input postal code. */
  postalCode?: Maybe<Scalars['String']>;
};

/** Input to the cancel order API. */
export type IUserOrderCancel = {
  /** Customer's email. */
  customerEmail?: Maybe<Scalars['String']>;
  /** Person's name. */
  orderId: Scalars['String'];
  /** Reason. */
  reason?: Maybe<Scalars['String']>;
};

export type LogisticsInfo = {
  __typename?: 'LogisticsInfo';
  /** LogisticsInfo itemIndex. */
  itemIndex?: Maybe<Scalars['String']>;
  /** LogisticsInfo selectedSla. */
  selectedSla?: Maybe<Scalars['String']>;
  /** List of LogisticsInfo ShippingSLA. */
  slas?: Maybe<Array<Maybe<ShippingSla>>>;
};

/** Shipping Simulation Logistic Item. */
export type LogisticsItem = {
  __typename?: 'LogisticsItem';
  /** LogisticsItem availability. */
  availability?: Maybe<Scalars['String']>;
  /** LogisticsItem ID / Sku. */
  id?: Maybe<Scalars['String']>;
  /** LogisticsItem listPrice. */
  listPrice?: Maybe<Scalars['Int']>;
  /** LogisticsItem measurementUnit. */
  measurementUnit?: Maybe<Scalars['String']>;
  /** LogisticsItem price. */
  price?: Maybe<Scalars['Int']>;
  /** Next date in which price is scheduled to change. If there is no scheduled change, this will be set a year in the future from current time. */
  priceValidUntil?: Maybe<Scalars['String']>;
  /** Number of items. */
  quantity?: Maybe<Scalars['Int']>;
  requestIndex?: Maybe<Scalars['Int']>;
  /** LogisticsItem rewardValue. */
  rewardValue?: Maybe<Scalars['Int']>;
  /** Seller responsible for the ShippingItem. */
  seller?: Maybe<Scalars['String']>;
  /** List of Sellers. */
  sellerChain?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** LogisticsItem sellingPrice. */
  sellingPrice?: Maybe<Scalars['Int']>;
  /** LogisticsItem tax. */
  tax?: Maybe<Scalars['Int']>;
  /** LogisticsItem unitMultiplier. */
  unitMultiplier?: Maybe<Scalars['Int']>;
};

export type MessageFields = {
  __typename?: 'MessageFields';
  /** MessageFields ean. */
  ean?: Maybe<Scalars['String']>;
  /** MessageFields item index. */
  itemIndex?: Maybe<Scalars['String']>;
  /** MessageFields sku name. */
  skuName?: Maybe<Scalars['String']>;
};

export type MessageInfo = {
  __typename?: 'MessageInfo';
  /** MessageInfo code. */
  code?: Maybe<Scalars['String']>;
  /** MessageInfo fields. */
  fields?: Maybe<MessageFields>;
  /** MessageInfo status. */
  status?: Maybe<Scalars['String']>;
  /** MessageInfo text. */
  text?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Cancels user order */
  cancelOrder?: Maybe<UserOrderCancel>;
  /** Process Order Authorization */
  processOrderAuthorization?: Maybe<ProcessOrderAuthorizationResponse>;
  /**
   * Sets a new password for the user.
   * This mutation is used to change the user's password, typically after a password reset or when the user wants to update their password.
   */
  setPassword?: Maybe<SetPasswordResponse>;
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


export type MutationSetPasswordArgs = {
  data: ISetPassword;
};


export type MutationSubscribeToNewsletterArgs = {
  data: IPersonNewsletter;
};


export type MutationValidateCartArgs = {
  cart: IStoreCart;
  session?: Maybe<IStoreSession>;
};


export type MutationValidateSessionArgs = {
  search: Scalars['String'];
  session: IStoreSession;
};

/** Newsletter information. */
export type PersonNewsletter = {
  __typename?: 'PersonNewsletter';
  /** Person's ID in the newsletter list. */
  id: Scalars['String'];
};

export type PickupAddress = {
  __typename?: 'PickupAddress';
  /** PickupAddress address id. */
  addressId?: Maybe<Scalars['String']>;
  /** PickupAddress address type. */
  addressType?: Maybe<Scalars['String']>;
  /** PickupAddress city. */
  city?: Maybe<Scalars['String']>;
  /** PickupAddress complement. */
  complement?: Maybe<Scalars['String']>;
  /** PickupAddress country. */
  country?: Maybe<Scalars['String']>;
  /** PickupAddress geo coordinates. */
  geoCoordinates?: Maybe<Array<Maybe<Scalars['Float']>>>;
  /** PickupAddress neighborhood. */
  neighborhood?: Maybe<Scalars['String']>;
  /** PickupAddress number. */
  number?: Maybe<Scalars['String']>;
  /** PickupAddress postal code. */
  postalCode?: Maybe<Scalars['String']>;
  /** PickupAddress receiver name. */
  receiverName?: Maybe<Scalars['String']>;
  /** PickupAddress reference. */
  reference?: Maybe<Scalars['String']>;
  /** PickupAddress state. */
  state?: Maybe<Scalars['String']>;
  /** PickupAddress street. */
  street?: Maybe<Scalars['String']>;
};

export type PickupPointAddress = {
  __typename?: 'PickupPointAddress';
  /** Address city. */
  city?: Maybe<Scalars['String']>;
  /** Address neighborhood. */
  neighborhood?: Maybe<Scalars['String']>;
  /** Address number. */
  number?: Maybe<Scalars['String']>;
  /** Address postal code. */
  postalCode?: Maybe<Scalars['String']>;
  /** Address street. */
  street?: Maybe<Scalars['String']>;
};

export type PickupPointDistance = {
  __typename?: 'PickupPointDistance';
  /** Pickup point address. */
  address?: Maybe<PickupPointAddress>;
  /** Pickup point business hours. */
  businessHours?: Maybe<Array<Maybe<BusinessHour>>>;
  /** Pickup point distance. */
  distance?: Maybe<Scalars['Float']>;
  /** Whether the pickup point is active. */
  isActive?: Maybe<Scalars['Boolean']>;
  /** Pickup point ID. */
  pickupId?: Maybe<Scalars['String']>;
  /** Pickup point name. */
  pickupName?: Maybe<Scalars['String']>;
};

export type PickupPoints = {
  __typename?: 'PickupPoints';
  /** List of pickup point distances for the given location. */
  pickupPointDistances?: Maybe<Array<Maybe<PickupPointDistance>>>;
  /** Hash of the pickup points data. */
  pickupPointsHash?: Maybe<Scalars['String']>;
};

export type PickupStoreInfo = {
  __typename?: 'PickupStoreInfo';
  /** PickupStoreInfo additional information. */
  additionalInfo?: Maybe<Scalars['String']>;
  /** PickupStoreInfo address. */
  address?: Maybe<PickupAddress>;
  /** PickupStoreInfo dock id. */
  dockId?: Maybe<Scalars['String']>;
  /** PickupStoreInfo friendly name. */
  friendlyName?: Maybe<Scalars['String']>;
  /** Information if the store has pickup enable. */
  isPickupStore?: Maybe<Scalars['Boolean']>;
};

/** Process Order Authorization response. */
export type ProcessOrderAuthorizationResponse = {
  __typename?: 'ProcessOrderAuthorizationResponse';
  /** Indicates if authorization is pending for other authorizers. */
  isPendingForOtherAuthorizer: Scalars['Boolean'];
  /** The updated rule for authorization, if any. */
  ruleForAuthorization?: Maybe<ProcessOrderAuthorizationRule>;
};

/** Extended Commercial Authorization rule with additional process context. */
export type ProcessOrderAuthorizationRule = {
  __typename?: 'ProcessOrderAuthorizationRule';
  /** Dimension ID. */
  dimensionId: Scalars['String'];
  /** Order authorization ID. */
  orderAuthorizationId: Scalars['String'];
  /** Base rule information. */
  rule: CommercialAuthorizationRule;
};

export type ProductCountResult = {
  __typename?: 'ProductCountResult';
  /** Total product count. */
  total: Scalars['Int'];
};

export type Profile = {
  __typename?: 'Profile';
  /** Collection of user's address */
  addresses?: Maybe<Array<Maybe<ProfileAddress>>>;
};

export type ProfileAddress = {
  __typename?: 'ProfileAddress';
  /** ProfileAddress address name/id. */
  addressName?: Maybe<Scalars['String']>;
  /** ProfileAddress address type. */
  addressType?: Maybe<Scalars['String']>;
  /** ProfileAddress city. */
  city?: Maybe<Scalars['String']>;
  /** ProfileAddress complement. */
  complement?: Maybe<Scalars['String']>;
  /** ProfileAddress country. */
  country?: Maybe<Scalars['String']>;
  /** ProfileAddress geo coordinate. */
  geoCoordinate?: Maybe<Array<Maybe<Scalars['Float']>>>;
  /** ProfileAddress neighborhood. */
  neighborhood?: Maybe<Scalars['String']>;
  /** ProfileAddress number. */
  number?: Maybe<Scalars['String']>;
  /** ProfileAddress postal code. */
  postalCode?: Maybe<Scalars['String']>;
  /** ProfileAddress receiver name. */
  receiverName?: Maybe<Scalars['String']>;
  /** ProfileAddress reference. */
  reference?: Maybe<Scalars['String']>;
  /** ProfileAddress state. */
  state?: Maybe<Scalars['String']>;
  /** ProfileAddress street. */
  street?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  /** Returns the account name of the current user or the B2B contract name if applicable. */
  accountName?: Maybe<Scalars['String']>;
  /** Returns the account profile information for the current authenticated user (b2b or b2c user). */
  accountProfile: StoreAccountProfile;
  /** Returns information about all collections. */
  allCollections: StoreCollectionConnection;
  /** Returns information about all products. */
  allProducts: StoreProductConnection;
  /** Returns the details of a collection based on the collection slug. */
  collection: StoreCollection;
  /** Returns information about the list of Orders that the User can view. */
  listUserOrders?: Maybe<UserOrderListMinimalResult>;
  /** Returns a list of pickup points near to the given geo coordinates or postal code + country code. */
  pickupPoints?: Maybe<PickupPoints>;
  /** Returns the details of a product based on the specified locator. */
  product: StoreProduct;
  /** Returns the total product count information based on a specific location accessible through the VTEX segment cookie. */
  productCount?: Maybe<ProductCountResult>;
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
  after?: Maybe<Scalars['String']>;
  first: Scalars['Int'];
};


export type QueryAllProductsArgs = {
  after?: Maybe<Scalars['String']>;
  first: Scalars['Int'];
};


export type QueryCollectionArgs = {
  slug: Scalars['String'];
};


export type QueryListUserOrdersArgs = {
  clientEmail?: Maybe<Scalars['String']>;
  dateFinal?: Maybe<Scalars['String']>;
  dateInitial?: Maybe<Scalars['String']>;
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
  status?: Maybe<Array<Maybe<Scalars['String']>>>;
  text?: Maybe<Scalars['String']>;
};


export type QueryPickupPointsArgs = {
  geoCoordinates?: Maybe<IStoreGeoCoordinates>;
};


export type QueryProductArgs = {
  locator: Array<IStoreSelectedFacet>;
};


export type QueryProductCountArgs = {
  term?: Maybe<Scalars['String']>;
};


export type QueryProfileArgs = {
  id: Scalars['String'];
};


export type QueryRedirectArgs = {
  selectedFacets?: Maybe<Array<IStoreSelectedFacet>>;
  term?: Maybe<Scalars['String']>;
};


export type QuerySearchArgs = {
  after?: Maybe<Scalars['String']>;
  first: Scalars['Int'];
  selectedFacets?: Maybe<Array<IStoreSelectedFacet>>;
  sort?: Maybe<StoreSort>;
  sponsoredCount?: Maybe<Scalars['Int']>;
  term?: Maybe<Scalars['String']>;
};


export type QuerySellersArgs = {
  country: Scalars['String'];
  geoCoordinates?: Maybe<IGeoCoordinates>;
  postalCode?: Maybe<Scalars['String']>;
  salesChannel?: Maybe<Scalars['String']>;
};


export type QueryShippingArgs = {
  country: Scalars['String'];
  items: Array<IShippingItem>;
  postalCode: Scalars['String'];
};


export type QueryUserOrderArgs = {
  orderId: Scalars['String'];
};

/** Search result. */
export type SearchMetadata = {
  __typename?: 'SearchMetadata';
  /** Indicates how the search engine corrected the misspelled word by using fuzzy logic. */
  fuzzy?: Maybe<Scalars['String']>;
  /** Indicates if the search term was misspelled. */
  isTermMisspelled: Scalars['Boolean'];
  /** Logical operator used to run the search. */
  logicalOperator: Scalars['String'];
};

/** Information of sellers. */
export type SellerInfo = {
  __typename?: 'SellerInfo';
  /** Identification of the seller */
  id?: Maybe<Scalars['String']>;
  /** Logo of the seller */
  logo?: Maybe<Scalars['String']>;
  /** Name of the seller */
  name?: Maybe<Scalars['String']>;
};

/** Regionalization with sellers information. */
export type SellersData = {
  __typename?: 'SellersData';
  /** Identification of region. */
  id?: Maybe<Scalars['String']>;
  /** List of sellers. */
  sellers?: Maybe<Array<Maybe<SellerInfo>>>;
};

/** Response type for setting a new password. */
export type SetPasswordResponse = {
  __typename?: 'SetPasswordResponse';
  /** Message providing additional information about the operation. */
  message?: Maybe<Scalars['String']>;
  /** Indicates whether the password was successfully set. */
  success: Scalars['Boolean'];
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
  carrier?: Maybe<Scalars['String']>;
  /** ShippingSLA delivery channel. */
  deliveryChannel?: Maybe<Scalars['String']>;
  /** List of ShippingSLA delivery ids. */
  deliveryIds?: Maybe<Array<Maybe<DeliveryIds>>>;
  /** ShippingSLA friendly name. */
  friendlyName?: Maybe<Scalars['String']>;
  /** ShippingSLA id. */
  id?: Maybe<Scalars['String']>;
  /**
   * ShippingSLA localized shipping estimate.
   * Note: this will always return a localized string for locale `en-US`.
   */
  localizedEstimates?: Maybe<Scalars['String']>;
  /** ShippingSLA name. */
  name?: Maybe<Scalars['String']>;
  /** ShippingSLA pickup distance. */
  pickupDistance?: Maybe<Scalars['Float']>;
  /** ShippingSLA pickup point id. */
  pickupPointId?: Maybe<Scalars['String']>;
  /** ShippingSLA pickup store info. */
  pickupStoreInfo?: Maybe<PickupStoreInfo>;
  /** ShippingSLA price. */
  price?: Maybe<Scalars['Float']>;
  /** ShippingSLA shipping estimate. */
  shippingEstimate?: Maybe<Scalars['String']>;
  /** ShippingSLA shipping estimate date. */
  shippingEstimateDate?: Maybe<Scalars['String']>;
};

export type SkuVariants = {
  __typename?: 'SkuVariants';
  /** SKU property values for the current SKU. */
  activeVariations?: Maybe<Scalars['ActiveVariations']>;
  /** All possible variant combinations of the current product. It also includes the data for each variant. */
  allVariantProducts?: Maybe<Array<StoreProduct>>;
  /** All available options for each SKU variant property, indexed by their name. */
  allVariantsByName?: Maybe<Scalars['VariantsByName']>;
  /**
   * Available options for each varying SKU property, taking into account the
   * `dominantVariantName` property. Returns all available options for the
   * dominant property, and only options that can be combined with its current
   * value for other properties.
   * If `dominantVariantName` is not present, the first variant will be
   * considered the dominant one.
   */
  availableVariations?: Maybe<Scalars['FormattedVariants']>;
  /**
   * Maps property value combinations to their respective SKU's slug. Enables
   * us to retrieve the slug for the SKU that matches the currently selected
   * variations in O(1) time.
   * If `dominantVariantName` is not present, the first variant will be
   * considered the dominant one.
   */
  slugsMap?: Maybe<Scalars['SlugsMap']>;
};


export type SkuVariantsAvailableVariationsArgs = {
  dominantVariantName?: Maybe<Scalars['String']>;
};


export type SkuVariantsSlugsMapArgs = {
  dominantVariantName?: Maybe<Scalars['String']>;
};

/** Account profile information. */
export type StoreAccountProfile = {
  __typename?: 'StoreAccountProfile';
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

/** Aggregate offer information, for a given SKU that is available to be fulfilled by multiple sellers. */
export type StoreAggregateOffer = {
  __typename?: 'StoreAggregateOffer';
  /** Highest price among all sellers. */
  highPrice: Scalars['Float'];
  /** Lowest price among all sellers. */
  lowPrice: Scalars['Float'];
  /** Lowest price among all sellers with current taxes. */
  lowPriceWithTaxes: Scalars['Float'];
  /** Number of sellers selling this SKU. */
  offerCount: Scalars['Int'];
  /** Array with information on each available offer. */
  offers: Array<StoreOffer>;
  /** ISO code of the currency used for the offer prices. */
  priceCurrency: Scalars['String'];
};

/** Average rating, based on multiple ratings or reviews. */
export type StoreAggregateRating = {
  __typename?: 'StoreAggregateRating';
  /** Value of the aggregate rating. */
  ratingValue: Scalars['Float'];
  /** Total number of ratings. */
  reviewCount: Scalars['Int'];
};

/** information about the author of a product review or rating. */
export type StoreAuthor = {
  __typename?: 'StoreAuthor';
  /** Author name. */
  name: Scalars['String'];
};

export type StoreB2B = {
  __typename?: 'StoreB2B';
  customerId: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  isRepresentative?: Maybe<Scalars['Boolean']>;
  lastName?: Maybe<Scalars['String']>;
  savedPostalCode?: Maybe<Scalars['String']>;
  unitId?: Maybe<Scalars['String']>;
  unitName?: Maybe<Scalars['String']>;
  userEmail?: Maybe<Scalars['String']>;
  userName?: Maybe<Scalars['String']>;
};

/** Brand of a given product. */
export type StoreBrand = {
  __typename?: 'StoreBrand';
  /** Brand name. */
  name: Scalars['String'];
};

/** List of items consisting of chain linked web pages, ending with the current page. */
export type StoreBreadcrumbList = {
  __typename?: 'StoreBreadcrumbList';
  /** Array with breadcrumb elements. */
  itemListElement: Array<StoreListItem>;
  /** Number of breadcrumbs in the list. */
  numberOfItems: Scalars['Int'];
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
  text: Scalars['String'];
};

/** Product collection information. */
export type StoreCollection = {
  __typename?: 'StoreCollection';
  /** List of items consisting of chain linked web pages, ending with the current page. */
  breadcrumbList: StoreBreadcrumbList;
  /** Collection ID. */
  id: Scalars['ID'];
  /** Collection meta information. Used for search. */
  meta: StoreCollectionMeta;
  /** Meta tag data. */
  seo: StoreSeo;
  /** Corresponding collection URL slug, with which to retrieve this entity. */
  slug: Scalars['String'];
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
  cursor: Scalars['String'];
  /** Each collection node contains the information of a product collection returned by the query. */
  node: StoreCollection;
};

/** Product collection facet, used for search. */
export type StoreCollectionFacet = {
  __typename?: 'StoreCollectionFacet';
  /** Facet key. */
  key: Scalars['String'];
  /** Facet value. */
  value: Scalars['String'];
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
  code: Scalars['String'];
  /** Currency symbol (e.g: $). */
  symbol: Scalars['String'];
};

/** Delivery mode information. */
export type StoreDeliveryMode = {
  __typename?: 'StoreDeliveryMode';
  /** The delivery channel information of the session. */
  deliveryChannel: Scalars['String'];
  /** The delivery method information of the session. */
  deliveryMethod: Scalars['String'];
  /** The delivery window information of the session. */
  deliveryWindow?: Maybe<StoreDeliveryWindow>;
};

/** Delivery window information. */
export type StoreDeliveryWindow = {
  __typename?: 'StoreDeliveryWindow';
  /** The delivery window end date information. */
  endDate: Scalars['String'];
  /** The delivery window start date information. */
  startDate: Scalars['String'];
};

export type StoreFacet = StoreFacetBoolean | StoreFacetRange;

/** Search facet boolean information. */
export type StoreFacetBoolean = {
  __typename?: 'StoreFacetBoolean';
  /** Facet key. */
  key: Scalars['String'];
  /** Facet label. */
  label: Scalars['String'];
  /** Array with information on each facet value. */
  values: Array<StoreFacetValueBoolean>;
};

/** Search facet range information. */
export type StoreFacetRange = {
  __typename?: 'StoreFacetRange';
  /** Facet key. */
  key: Scalars['String'];
  /** Facet label. */
  label: Scalars['String'];
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
  label: Scalars['String'];
  /** Number of items with this facet. */
  quantity: Scalars['Int'];
  /** Indicates whether facet is selected. */
  selected: Scalars['Boolean'];
  /** Facet value. */
  value: Scalars['String'];
};

/** Search facet range value information. Used for minimum and maximum range values. */
export type StoreFacetValueRange = {
  __typename?: 'StoreFacetValueRange';
  /** Search facet range absolute value. */
  absolute: Scalars['Float'];
  /** Search facet range selected value. */
  selected: Scalars['Float'];
};

/** Geographic coordinates information. */
export type StoreGeoCoordinates = {
  __typename?: 'StoreGeoCoordinates';
  /** The latitude of the geographic coordinates. */
  latitude: Scalars['Float'];
  /** The longitude of the geographic coordinates. */
  longitude: Scalars['Float'];
};

/** Image. */
export type StoreImage = {
  __typename?: 'StoreImage';
  /** Alias for the image. */
  alternateName: Scalars['String'];
  /** Image URL. */
  url: Scalars['String'];
};

/** Item of a list. */
export type StoreListItem = {
  __typename?: 'StoreListItem';
  /** List item value. */
  item: Scalars['String'];
  /** Name of the list item. */
  name: Scalars['String'];
  /** Position of the item in the list. */
  position: Scalars['Int'];
};

/** Marketing information. */
export type StoreMarketingData = {
  __typename?: 'StoreMarketingData';
  utmCampaign?: Maybe<Scalars['String']>;
  utmMedium?: Maybe<Scalars['String']>;
  utmSource?: Maybe<Scalars['String']>;
  utmiCampaign?: Maybe<Scalars['String']>;
  utmiPage?: Maybe<Scalars['String']>;
  utmiPart?: Maybe<Scalars['String']>;
};

/** Offer information. */
export type StoreOffer = {
  __typename?: 'StoreOffer';
  /** Offer item availability. */
  availability: Scalars['String'];
  /** Offer item condition. */
  itemCondition: Scalars['String'];
  /** Information on the item being offered. */
  itemOffered: StoreProduct;
  /** This is displayed as the "from" price in the context of promotions' price comparison. This may change before it reaches the shelf. */
  listPrice: Scalars['Float'];
  /** List price among with current taxes. */
  listPriceWithTaxes: Scalars['Float'];
  /** Also known as spot price. */
  price: Scalars['Float'];
  /** ISO code of the currency used for the offer prices. */
  priceCurrency: Scalars['String'];
  /** Next date in which price is scheduled to change. If there is no scheduled change, this will be set a year in the future from current time. */
  priceValidUntil: Scalars['String'];
  /** Also known as spot price with taxes. */
  priceWithTaxes: Scalars['Float'];
  /** Number of items offered. */
  quantity: Scalars['Int'];
  /** Seller responsible for the offer. */
  seller: StoreOrganization;
  /** Computed price before applying coupons, taxes or benefits. This may change before it reaches the shelf. */
  sellingPrice: Scalars['Float'];
};

/** Information of a specific order. */
export type StoreOrder = {
  __typename?: 'StoreOrder';
  /** Array with information on each accepted offer. */
  acceptedOffer: Array<StoreOffer>;
  /** ID of the order in [VTEX order management](https://help.vtex.com/en/tutorial/license-manager-resources-oms--60QcBsvWeum02cFi3GjBzg#). */
  orderNumber: Scalars['String'];
  /** Indicates whether or not items with attachments should be split. */
  shouldSplitItem?: Maybe<Scalars['Boolean']>;
};

/** Organization. */
export type StoreOrganization = {
  __typename?: 'StoreOrganization';
  /** Organization ID. */
  identifier: Scalars['String'];
};

/** Whenever you make a query that allows for pagination, such as `allProducts` or `allCollections`, you can check `StorePageInfo` to learn more about the complete set of items and use it to paginate your queries. */
export type StorePageInfo = {
  __typename?: 'StorePageInfo';
  /** Cursor corresponding to the last possible item. */
  endCursor: Scalars['String'];
  /** Indicates whether there is at least one more page with items after the ones returned in the current query. */
  hasNextPage: Scalars['Boolean'];
  /** Indicates whether there is at least one more page with items before the ones returned in the current query. */
  hasPreviousPage: Scalars['Boolean'];
  /** Cursor corresponding to the first possible item. */
  startCursor: Scalars['String'];
  /** Total number of items (products or collections), not pages. */
  totalCount: Scalars['Int'];
};

/** Client profile data. */
export type StorePerson = {
  __typename?: 'StorePerson';
  /** Client email. */
  email: Scalars['String'];
  /** Client last name. */
  familyName: Scalars['String'];
  /** Client first name. */
  givenName: Scalars['String'];
  /** Client ID. */
  id: Scalars['String'];
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
  /** Product description. */
  description: Scalars['String'];
  /** Global Trade Item Number. */
  gtin: Scalars['String'];
  /** Array of images. */
  image: Array<StoreImage>;
  /** Indicates product group related to this product. */
  isVariantOf: StoreProductGroup;
  /** Product name. */
  name: Scalars['String'];
  /** Aggregate offer information. */
  offers: StoreAggregateOffer;
  /** Product ID, such as [ISBN](https://www.isbn-international.org/content/what-isbn) or similar global IDs. */
  productID: Scalars['String'];
  /** The product's release date. Formatted using https://en.wikipedia.org/wiki/ISO_8601 */
  releaseDate: Scalars['String'];
  /** Array with review information. */
  review: Array<StoreReview>;
  /** Meta tag data. */
  seo: StoreSeo;
  /** Stock Keeping Unit. Merchant-specific ID for the product. */
  sku: Scalars['String'];
  /** Corresponding collection URL slug, with which to retrieve this entity. */
  slug: Scalars['String'];
  /** Sku Unit Multiplier */
  unitMultiplier?: Maybe<Scalars['Float']>;
};


/** Product information. Products are variants within product groups, equivalent to VTEX [SKUs](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). For example, you may have a **Shirt** product group with associated products such as **Blue shirt size L**, **Green shirt size XL** and so on. */
export type StoreProductImageArgs = {
  context?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
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
  cursor: Scalars['String'];
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
  name: Scalars['String'];
  /** Product group ID. */
  productGroupID: Scalars['String'];
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
  name: Scalars['String'];
  /** Property id. This propert changes according to the content of the object. */
  propertyID: Scalars['String'];
  /** Property value. May hold a string or the string representation of an object. */
  value: Scalars['ObjectOrString'];
  /** Specifies the nature of the value */
  valueReference: Scalars['ObjectOrString'];
};

/**
 * Redirect informations, including url returned by the query.
 * https://schema.org/Thing
 */
export type StoreRedirect = {
  __typename?: 'StoreRedirect';
  /** URL to redirect */
  url?: Maybe<Scalars['String']>;
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
  bestRating: Scalars['Float'];
  /** Rating value. */
  ratingValue: Scalars['Float'];
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
  canonical: Scalars['String'];
  /** Description tag. */
  description: Scalars['String'];
  /** Title tag. */
  title: Scalars['String'];
  /** Title template tag. */
  titleTemplate: Scalars['String'];
};

/** Session information. */
export type StoreSession = {
  __typename?: 'StoreSession';
  /** Session address type. */
  addressType?: Maybe<Scalars['String']>;
  /** B2B Information. */
  b2b?: Maybe<StoreB2B>;
  /** Session channel. */
  channel?: Maybe<Scalars['String']>;
  /** Session city. */
  city?: Maybe<Scalars['String']>;
  /** Session country. */
  country: Scalars['String'];
  /** Session currency. */
  currency: StoreCurrency;
  /** Session delivery mode. */
  deliveryMode?: Maybe<StoreDeliveryMode>;
  /** Session input geoCoordinates. */
  geoCoordinates?: Maybe<StoreGeoCoordinates>;
  /** Session locale. */
  locale: Scalars['String'];
  /** Marketing information. */
  marketingData?: Maybe<StoreMarketingData>;
  /** Session input person. */
  person?: Maybe<StorePerson>;
  /** Session postal code. */
  postalCode?: Maybe<Scalars['String']>;
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
  count: Scalars['Int'];
  /** The term. */
  value: Scalars['String'];
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
  email?: Maybe<Scalars['String']>;
  /** User's name. */
  name?: Maybe<Scalars['String']>;
  /** User's organizational unit. */
  orgUnit?: Maybe<Scalars['String']>;
  /** User's role. */
  role?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type UserOrder = {
  __typename?: 'UserOrder';
  affiliateId?: Maybe<Scalars['String']>;
  allowCancellation?: Maybe<Scalars['Boolean']>;
  allowEdition?: Maybe<Scalars['Boolean']>;
  authorizedDate?: Maybe<Scalars['String']>;
  callCenterOperatorData?: Maybe<Scalars['String']>;
  canProcessOrderAuthorization?: Maybe<Scalars['Boolean']>;
  cancelReason?: Maybe<Scalars['String']>;
  cancellationData?: Maybe<UserOrderCancellationData>;
  cancellationRequests?: Maybe<Array<Maybe<UserOrderCancellationRequest>>>;
  changesAttachment?: Maybe<Scalars['String']>;
  checkedInPickupPointId?: Maybe<Scalars['String']>;
  clientPreferencesData?: Maybe<UserOrderClientPreferencesData>;
  clientProfileData?: Maybe<UserOrderClientProfileData>;
  commercialConditionData?: Maybe<Scalars['String']>;
  creationDate?: Maybe<Scalars['String']>;
  customData?: Maybe<UserOrderCustomData>;
  customFields?: Maybe<Array<Maybe<UserOrderCustomFieldsGrouped>>>;
  deliveryOptionsData?: Maybe<UserOrderDeliveryOptionsData>;
  followUpEmail?: Maybe<Scalars['String']>;
  giftRegistryData?: Maybe<Scalars['String']>;
  hostname?: Maybe<Scalars['String']>;
  invoiceData?: Maybe<Scalars['String']>;
  invoicedDate?: Maybe<Scalars['String']>;
  isCheckedIn?: Maybe<Scalars['Boolean']>;
  isCompleted?: Maybe<Scalars['Boolean']>;
  itemMetadata?: Maybe<UserOrderItemMetadata>;
  items?: Maybe<Array<Maybe<UserOrderItems>>>;
  lastChange?: Maybe<Scalars['String']>;
  lastMessage?: Maybe<Scalars['String']>;
  marketingData?: Maybe<Scalars['String']>;
  marketplace?: Maybe<UserOrderMarketplace>;
  marketplaceItems?: Maybe<Array<Maybe<UserOrderItems>>>;
  marketplaceOrderId?: Maybe<Scalars['String']>;
  marketplaceServicesEndpoint?: Maybe<Scalars['String']>;
  merchantName?: Maybe<Scalars['String']>;
  openTextField?: Maybe<Scalars['String']>;
  orderFormId?: Maybe<Scalars['String']>;
  orderGroup?: Maybe<Scalars['String']>;
  orderId?: Maybe<Scalars['String']>;
  origin?: Maybe<Scalars['String']>;
  packageAttachment?: Maybe<UserOrderPackageAttachment>;
  paymentData?: Maybe<UserOrderPaymentData>;
  ratesAndBenefitsData?: Maybe<UserOrderRatesAndBenefitsData>;
  roundingError?: Maybe<Scalars['Int']>;
  ruleForAuthorization?: Maybe<ProcessOrderAuthorizationRule>;
  salesChannel?: Maybe<Scalars['String']>;
  sellerOrderId?: Maybe<Scalars['String']>;
  sellers?: Maybe<Array<Maybe<UserOrderStoreSellers>>>;
  sequence?: Maybe<Scalars['String']>;
  shippingData?: Maybe<UserOrderShippingData>;
  status?: Maybe<Scalars['String']>;
  statusDescription?: Maybe<Scalars['String']>;
  storePreferencesData?: Maybe<UserOrderStorePreferencesData>;
  subscriptionData?: Maybe<Scalars['String']>;
  taxData?: Maybe<Scalars['String']>;
  totals?: Maybe<Array<Maybe<UserOrderTotals>>>;
  value?: Maybe<Scalars['Float']>;
  workflowIsInError?: Maybe<Scalars['Boolean']>;
};

export type UserOrderAdditionalInfo = {
  __typename?: 'UserOrderAdditionalInfo';
  brandId?: Maybe<Scalars['String']>;
  brandName?: Maybe<Scalars['String']>;
  categories?: Maybe<Array<Maybe<UserOrderCategories>>>;
  categoriesIds?: Maybe<Scalars['String']>;
  commercialConditionId?: Maybe<Scalars['String']>;
  dimension?: Maybe<UserOrderDimension>;
  offeringInfo?: Maybe<Scalars['String']>;
  offeringType?: Maybe<Scalars['String']>;
  offeringTypeId?: Maybe<Scalars['String']>;
  productClusterId?: Maybe<Scalars['String']>;
};

export type UserOrderAddress = {
  __typename?: 'UserOrderAddress';
  addressId?: Maybe<Scalars['String']>;
  addressType?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  complement?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  entityId?: Maybe<Scalars['String']>;
  geoCoordinates?: Maybe<Array<Maybe<Scalars['Float']>>>;
  neighborhood?: Maybe<Scalars['String']>;
  number?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  receiverName?: Maybe<Scalars['String']>;
  reference?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  versionId?: Maybe<Scalars['String']>;
};

export type UserOrderAssemblyOptions = {
  __typename?: 'UserOrderAssemblyOptions';
  Id?: Maybe<Scalars['String']>;
  Name?: Maybe<Scalars['String']>;
  Required?: Maybe<Scalars['Boolean']>;
};

export type UserOrderAttachmentOfferings = {
  __typename?: 'UserOrderAttachmentOfferings';
  name?: Maybe<Scalars['String']>;
  required?: Maybe<Scalars['Boolean']>;
};

export type UserOrderAttachments = {
  __typename?: 'UserOrderAttachments';
  content?: Maybe<Scalars['JSONObject']>;
  name?: Maybe<Scalars['String']>;
};

export type UserOrderCancel = {
  __typename?: 'UserOrderCancel';
  data?: Maybe<Scalars['String']>;
};

export type UserOrderCancellationData = {
  __typename?: 'UserOrderCancellationData';
  CancellationDate?: Maybe<Scalars['String']>;
  Reason?: Maybe<Scalars['String']>;
  RequestedByPaymentNotification?: Maybe<Scalars['Boolean']>;
  RequestedBySellerNotification?: Maybe<Scalars['Boolean']>;
  RequestedBySystem?: Maybe<Scalars['Boolean']>;
  RequestedByUser?: Maybe<Scalars['Boolean']>;
};

export type UserOrderCancellationRequest = {
  __typename?: 'UserOrderCancellationRequest';
  cancellationRequestDate?: Maybe<Scalars['String']>;
  cancellationRequestDenyDate?: Maybe<Scalars['String']>;
  deniedBySeller?: Maybe<Scalars['Boolean']>;
  deniedBySellerReason?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
  requestedByUser?: Maybe<Scalars['Boolean']>;
};

export type UserOrderCategories = {
  __typename?: 'UserOrderCategories';
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

export type UserOrderClientPreferencesData = {
  __typename?: 'UserOrderClientPreferencesData';
  locale?: Maybe<Scalars['String']>;
  optinNewsLetter?: Maybe<Scalars['Boolean']>;
};

export type UserOrderClientProfileData = {
  __typename?: 'UserOrderClientProfileData';
  corporateDocument?: Maybe<Scalars['String']>;
  corporateName?: Maybe<Scalars['String']>;
  corporatePhone?: Maybe<Scalars['String']>;
  customerClass?: Maybe<Scalars['String']>;
  customerCode?: Maybe<Scalars['String']>;
  document?: Maybe<Scalars['String']>;
  documentType?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  isCorporate?: Maybe<Scalars['Boolean']>;
  lastName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  stateInscription?: Maybe<Scalars['String']>;
  tradeName?: Maybe<Scalars['String']>;
  userProfileId?: Maybe<Scalars['String']>;
  userProfileVersion?: Maybe<Scalars['String']>;
};

export type UserOrderContactInformation = {
  __typename?: 'UserOrderContactInformation';
  document?: Maybe<Scalars['String']>;
  documentType?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
};

export type UserOrderCourierStatus = {
  __typename?: 'UserOrderCourierStatus';
  data?: Maybe<Array<UserOrderTrackingInformation>>;
  finished?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
};

export type UserOrderCurrencyFormatInfo = {
  __typename?: 'UserOrderCurrencyFormatInfo';
  CurrencyDecimalDigits?: Maybe<Scalars['Int']>;
  CurrencyDecimalSeparator?: Maybe<Scalars['String']>;
  CurrencyGroupSeparator?: Maybe<Scalars['String']>;
  CurrencyGroupSize?: Maybe<Scalars['Int']>;
  StartsWithCurrencySymbol?: Maybe<Scalars['Boolean']>;
};

export type UserOrderCustomApp = {
  __typename?: 'UserOrderCustomApp';
  fields?: Maybe<UserOrderFields>;
  id?: Maybe<Scalars['String']>;
  major?: Maybe<Scalars['Int']>;
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
  name: Scalars['String'];
  refId?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export type UserOrderCustomFieldLinkedEntity = {
  __typename?: 'UserOrderCustomFieldLinkedEntity';
  id?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type UserOrderCustomFieldsGrouped = {
  __typename?: 'UserOrderCustomFieldsGrouped';
  fields?: Maybe<Array<Maybe<UserOrderCustomFieldField>>>;
  id?: Maybe<Scalars['String']>;
  type: Scalars['String'];
};

export type UserOrderDeliveryChannels = {
  __typename?: 'UserOrderDeliveryChannels';
  id?: Maybe<Scalars['String']>;
  stockBalance?: Maybe<Scalars['Int']>;
};

export type UserOrderDeliveryIds = {
  __typename?: 'UserOrderDeliveryIds';
  accountCarrierName?: Maybe<Scalars['String']>;
  courierId?: Maybe<Scalars['String']>;
  courierName?: Maybe<Scalars['String']>;
  dockId?: Maybe<Scalars['String']>;
  kitItemDetails?: Maybe<Array<Maybe<Scalars['String']>>>;
  quantity?: Maybe<Scalars['Int']>;
  warehouseId?: Maybe<Scalars['String']>;
};

export type UserOrderDeliveryOption = {
  __typename?: 'UserOrderDeliveryOption';
  address?: Maybe<UserOrderAddress>;
  deliveryChannel?: Maybe<Scalars['String']>;
  deliveryCompany?: Maybe<Scalars['String']>;
  deliveryWindow?: Maybe<UserOrderDeliveryWindow>;
  friendlyDeliveryOptionName?: Maybe<Scalars['String']>;
  friendlyShippingEstimate?: Maybe<Scalars['String']>;
  items?: Maybe<Array<Maybe<UserOrderDeliveryOptionsItems>>>;
  pickupStoreInfo?: Maybe<UserOrderPickupStoreInfo>;
  quantityOfDifferentItems?: Maybe<Scalars['Int']>;
  selectedSla?: Maybe<Scalars['String']>;
  seller?: Maybe<Scalars['String']>;
  shippingEstimate?: Maybe<Scalars['String']>;
  shippingEstimateDate?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
};

export type UserOrderDeliveryOptionsContact = {
  __typename?: 'UserOrderDeliveryOptionsContact';
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
};

export type UserOrderDeliveryOptionsData = {
  __typename?: 'UserOrderDeliveryOptionsData';
  contact?: Maybe<UserOrderDeliveryOptionsContact>;
  deliveryOptions?: Maybe<Array<Maybe<UserOrderDeliveryOption>>>;
};

export type UserOrderDeliveryOptionsItems = {
  __typename?: 'UserOrderDeliveryOptionsItems';
  id?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Int']>;
  tax?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Float']>;
  uniqueId?: Maybe<Scalars['String']>;
};

export type UserOrderDeliveryWindow = {
  __typename?: 'UserOrderDeliveryWindow';
  endDateUtc?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  startDateUtc?: Maybe<Scalars['String']>;
};

export type UserOrderDimension = {
  __typename?: 'UserOrderDimension';
  cubicweight?: Maybe<Scalars['Float']>;
  height?: Maybe<Scalars['Int']>;
  length?: Maybe<Scalars['Int']>;
  weight?: Maybe<Scalars['Int']>;
  width?: Maybe<Scalars['Int']>;
};

export type UserOrderFields = {
  __typename?: 'UserOrderFields';
  cartEtag?: Maybe<Scalars['String']>;
};

export type UserOrderFromList = {
  __typename?: 'UserOrderFromList';
  ShippingEstimatedDate?: Maybe<Scalars['String']>;
  ShippingEstimatedDateMax?: Maybe<Scalars['String']>;
  ShippingEstimatedDateMin?: Maybe<Scalars['String']>;
  affiliateId?: Maybe<Scalars['String']>;
  authorizedDate?: Maybe<Scalars['String']>;
  callCenterOperatorName?: Maybe<Scalars['String']>;
  clientName?: Maybe<Scalars['String']>;
  creationDate?: Maybe<Scalars['String']>;
  currencyCode?: Maybe<Scalars['String']>;
  customFields?: Maybe<Array<Maybe<UserOrderFromListCustomFields>>>;
  deliveryDates?: Maybe<Array<Maybe<Scalars['String']>>>;
  giftCardProviders?: Maybe<Array<Maybe<Scalars['String']>>>;
  hostname?: Maybe<Scalars['String']>;
  invoiceInput?: Maybe<Array<Maybe<Scalars['String']>>>;
  invoiceOutput?: Maybe<Array<Maybe<Scalars['String']>>>;
  isAllDelivered?: Maybe<Scalars['Boolean']>;
  isAnyDelivered?: Maybe<Scalars['Boolean']>;
  items?: Maybe<Array<Maybe<UserOrderItemsSummarized>>>;
  lastChange?: Maybe<Scalars['String']>;
  lastMessageUnread?: Maybe<Scalars['String']>;
  listId?: Maybe<Scalars['String']>;
  listType?: Maybe<Scalars['String']>;
  marketPlaceOrderId?: Maybe<Scalars['String']>;
  orderFormId?: Maybe<Scalars['String']>;
  orderId?: Maybe<Scalars['String']>;
  orderIsComplete?: Maybe<Scalars['Boolean']>;
  origin?: Maybe<Scalars['String']>;
  paymentApprovedDate?: Maybe<Scalars['String']>;
  paymentNames?: Maybe<Scalars['String']>;
  readyForHandlingDate?: Maybe<Scalars['String']>;
  salesChannel?: Maybe<Scalars['String']>;
  sequence?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  statusDescription?: Maybe<Scalars['String']>;
  totalItems?: Maybe<Scalars['Int']>;
  totalValue?: Maybe<Scalars['Float']>;
  workflowInErrorState?: Maybe<Scalars['Boolean']>;
  workflowInRetry?: Maybe<Scalars['Boolean']>;
};

export type UserOrderFromListCustomFields = {
  __typename?: 'UserOrderFromListCustomFields';
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type UserOrderFromListMinimal = {
  __typename?: 'UserOrderFromListMinimal';
  ShippingEstimatedDate?: Maybe<Scalars['String']>;
  clientName?: Maybe<Scalars['String']>;
  creationDate?: Maybe<Scalars['String']>;
  currencyCode?: Maybe<Scalars['String']>;
  customFields?: Maybe<Array<Maybe<UserOrderFromListCustomFields>>>;
  items?: Maybe<Array<Maybe<UserOrderItemsSummarized>>>;
  orderId?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  statusDescription?: Maybe<Scalars['String']>;
  totalValue?: Maybe<Scalars['Float']>;
};

export const enum UserOrderInvoiceType {
  Input = 'Input',
  Output = 'Output'
};

export type UserOrderItemAttachment = {
  __typename?: 'UserOrderItemAttachment';
  name?: Maybe<Scalars['String']>;
};

export type UserOrderItemMetadata = {
  __typename?: 'UserOrderItemMetadata';
  Items?: Maybe<Array<Maybe<UserOrderItemMetadataItem>>>;
};

export type UserOrderItemMetadataItem = {
  __typename?: 'UserOrderItemMetadataItem';
  AssemblyOptions?: Maybe<Array<Maybe<UserOrderAssemblyOptions>>>;
  DetailUrl?: Maybe<Scalars['String']>;
  Ean?: Maybe<Scalars['String']>;
  Id?: Maybe<Scalars['String']>;
  ImageUrl?: Maybe<Scalars['String']>;
  Name?: Maybe<Scalars['String']>;
  ProductId?: Maybe<Scalars['String']>;
  RefId?: Maybe<Scalars['String']>;
  Seller?: Maybe<Scalars['String']>;
  SkuName?: Maybe<Scalars['String']>;
};

export type UserOrderItems = {
  __typename?: 'UserOrderItems';
  additionalInfo?: Maybe<UserOrderAdditionalInfo>;
  assemblies?: Maybe<Array<Maybe<Scalars['String']>>>;
  attachmentOfferings?: Maybe<Array<Maybe<UserOrderAttachmentOfferings>>>;
  attachments?: Maybe<Array<Maybe<UserOrderAttachments>>>;
  bundleItems?: Maybe<Array<Maybe<UserOrderItems>>>;
  callCenterOperator?: Maybe<Scalars['String']>;
  commission?: Maybe<Scalars['Float']>;
  components?: Maybe<Array<Maybe<UserOrderItems>>>;
  costPrice?: Maybe<Scalars['Float']>;
  detailUrl?: Maybe<Scalars['String']>;
  ean?: Maybe<Scalars['String']>;
  freightCommission?: Maybe<Scalars['Float']>;
  id?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  isGift?: Maybe<Scalars['Boolean']>;
  itemAttachment?: Maybe<UserOrderItemAttachment>;
  listPrice?: Maybe<Scalars['Float']>;
  lockId?: Maybe<Scalars['String']>;
  manualPrice?: Maybe<Scalars['String']>;
  manualPriceAppliedBy?: Maybe<Scalars['String']>;
  measurementUnit?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  offerings?: Maybe<Array<Maybe<UserOrderOfferings>>>;
  params?: Maybe<Array<Maybe<Scalars['String']>>>;
  parentAssemblyBinding?: Maybe<Scalars['String']>;
  parentItemIndex?: Maybe<Scalars['String']>;
  preSaleDate?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  priceDefinition?: Maybe<UserOrderPriceDefinition>;
  priceTags?: Maybe<Array<Maybe<UserOrderPriceTag>>>;
  priceValidUntil?: Maybe<Scalars['String']>;
  productId?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  refId?: Maybe<Scalars['String']>;
  rewardValue?: Maybe<Scalars['Float']>;
  seller?: Maybe<Scalars['String']>;
  sellerSku?: Maybe<Scalars['String']>;
  sellingPrice?: Maybe<Scalars['Float']>;
  serialNumbers?: Maybe<Scalars['String']>;
  shippingPrice?: Maybe<Scalars['String']>;
  tax?: Maybe<Scalars['Float']>;
  taxCode?: Maybe<Scalars['String']>;
  uniqueId?: Maybe<Scalars['String']>;
  unitMultiplier?: Maybe<Scalars['Float']>;
};

export type UserOrderItemsSummarized = {
  __typename?: 'UserOrderItemsSummarized';
  description?: Maybe<Scalars['String']>;
  ean?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  productId?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  refId?: Maybe<Scalars['String']>;
  seller?: Maybe<Scalars['String']>;
  sellingPrice?: Maybe<Scalars['Float']>;
};

export type UserOrderListMinimalResult = {
  __typename?: 'UserOrderListMinimalResult';
  list?: Maybe<Array<Maybe<UserOrderFromListMinimal>>>;
  paging?: Maybe<UserOrderListPaging>;
};

export type UserOrderListPaging = {
  __typename?: 'UserOrderListPaging';
  currentPage?: Maybe<Scalars['Int']>;
  pages?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export type UserOrderListResult = {
  __typename?: 'UserOrderListResult';
  facets?: Maybe<Array<Maybe<Scalars['String']>>>;
  list?: Maybe<Array<UserOrderFromList>>;
  paging?: Maybe<UserOrderListPaging>;
  reportRecordsLimit?: Maybe<Scalars['Int']>;
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
  Count?: Maybe<Scalars['Int']>;
  Facets?: Maybe<Scalars['JSONObject']>;
  Max?: Maybe<Scalars['Float']>;
  Mean?: Maybe<Scalars['Float']>;
  Min?: Maybe<Scalars['Float']>;
  Missing?: Maybe<Scalars['Int']>;
  StdDev?: Maybe<Scalars['Float']>;
  Sum?: Maybe<Scalars['Float']>;
  SumOfSquares?: Maybe<Scalars['Float']>;
};

export type UserOrderLogisticsInfo = {
  __typename?: 'UserOrderLogisticsInfo';
  addressId?: Maybe<Scalars['String']>;
  deliveryChannel?: Maybe<Scalars['String']>;
  deliveryChannels?: Maybe<Array<Maybe<UserOrderDeliveryChannels>>>;
  deliveryCompany?: Maybe<Scalars['String']>;
  deliveryIds?: Maybe<Array<Maybe<UserOrderDeliveryIds>>>;
  deliveryWindow?: Maybe<UserOrderDeliveryWindow>;
  entityId?: Maybe<Scalars['String']>;
  itemId?: Maybe<Scalars['String']>;
  itemIndex?: Maybe<Scalars['Int']>;
  listPrice?: Maybe<Scalars['Float']>;
  lockTTL?: Maybe<Scalars['String']>;
  pickupPointId?: Maybe<Scalars['String']>;
  pickupStoreInfo?: Maybe<UserOrderPickupStoreInfo>;
  polygonName?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  selectedDeliveryChannel?: Maybe<Scalars['String']>;
  selectedSla?: Maybe<Scalars['String']>;
  sellingPrice?: Maybe<Scalars['Float']>;
  shippingEstimate?: Maybe<Scalars['String']>;
  shippingEstimateDate?: Maybe<Scalars['String']>;
  shipsTo?: Maybe<Array<Maybe<Scalars['String']>>>;
  slas?: Maybe<Array<Maybe<UserOrderSlas>>>;
  transitTime?: Maybe<Scalars['String']>;
  versionId?: Maybe<Scalars['String']>;
};

export type UserOrderMarketplace = {
  __typename?: 'UserOrderMarketplace';
  baseURL?: Maybe<Scalars['String']>;
  isCertified?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type UserOrderOfferings = {
  __typename?: 'UserOrderOfferings';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  type?: Maybe<Scalars['String']>;
};

export type UserOrderPackage = {
  __typename?: 'UserOrderPackage';
  courier?: Maybe<Scalars['String']>;
  courierStatus?: Maybe<UserOrderCourierStatus>;
  extraValue?: Maybe<Scalars['Float']>;
  invoiceKey?: Maybe<Scalars['String']>;
  invoiceNumber: Scalars['String'];
  invoiceUrl?: Maybe<Scalars['String']>;
  invoiceValue: Scalars['Float'];
  issuanceDate?: Maybe<Scalars['String']>;
  items?: Maybe<Array<UserOrderPackageItem>>;
  restitutions?: Maybe<UserOrderRestitutions>;
  trackingNumber?: Maybe<Scalars['String']>;
  trackingUrl?: Maybe<Scalars['String']>;
  type?: Maybe<UserOrderInvoiceType>;
};

export type UserOrderPackageAttachment = {
  __typename?: 'UserOrderPackageAttachment';
  packages?: Maybe<Array<Maybe<UserOrderPackage>>>;
};

export type UserOrderPackageItem = {
  __typename?: 'UserOrderPackageItem';
  description?: Maybe<Scalars['String']>;
  itemIndex?: Maybe<Scalars['Int']>;
  price?: Maybe<Scalars['Int']>;
  quantity?: Maybe<Scalars['Int']>;
};

export type UserOrderPaymentConnectorResponses = {
  __typename?: 'UserOrderPaymentConnectorResponses';
  Message?: Maybe<Scalars['String']>;
  ReturnCode?: Maybe<Scalars['String']>;
  Tid?: Maybe<Scalars['String']>;
  authId?: Maybe<Scalars['String']>;
};

export type UserOrderPaymentData = {
  __typename?: 'UserOrderPaymentData';
  giftCards?: Maybe<Array<Maybe<Scalars['String']>>>;
  transactions?: Maybe<Array<Maybe<UserOrderTransactions>>>;
};

export type UserOrderPayments = {
  __typename?: 'UserOrderPayments';
  accountId?: Maybe<Scalars['String']>;
  bankIssuedInvoiceBarCodeNumber?: Maybe<Scalars['String']>;
  bankIssuedInvoiceBarCodeType?: Maybe<Scalars['String']>;
  bankIssuedInvoiceIdentificationNumber?: Maybe<Scalars['String']>;
  bankIssuedInvoiceIdentificationNumberFormatted?: Maybe<Scalars['String']>;
  billingAddress?: Maybe<Scalars['String']>;
  cardHolder?: Maybe<Scalars['String']>;
  cardNumber?: Maybe<Scalars['String']>;
  connectorResponses?: Maybe<UserOrderPaymentConnectorResponses>;
  cvv2?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['String']>;
  expireMonth?: Maybe<Scalars['String']>;
  expireYear?: Maybe<Scalars['String']>;
  firstDigits?: Maybe<Scalars['String']>;
  giftCardAsDiscount?: Maybe<Scalars['String']>;
  giftCardCaption?: Maybe<Scalars['String']>;
  giftCardId?: Maybe<Scalars['String']>;
  giftCardName?: Maybe<Scalars['String']>;
  giftCardProvider?: Maybe<Scalars['String']>;
  group?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  installments?: Maybe<Scalars['Int']>;
  koinUrl?: Maybe<Scalars['String']>;
  lastDigits?: Maybe<Scalars['String']>;
  parentAccountId?: Maybe<Scalars['String']>;
  paymentOrigin?: Maybe<Scalars['String']>;
  paymentSystem?: Maybe<Scalars['String']>;
  paymentSystemName?: Maybe<Scalars['String']>;
  redemptionCode?: Maybe<Scalars['String']>;
  referenceValue?: Maybe<Scalars['Int']>;
  tid?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Int']>;
};

export type UserOrderPickupStoreInfo = {
  __typename?: 'UserOrderPickupStoreInfo';
  additionalInfo?: Maybe<Scalars['String']>;
  address?: Maybe<UserOrderAddress>;
  dockId?: Maybe<Scalars['String']>;
  friendlyName?: Maybe<Scalars['String']>;
  isPickupStore?: Maybe<Scalars['Boolean']>;
};

export type UserOrderPriceDefinition = {
  __typename?: 'UserOrderPriceDefinition';
  calculatedSellingPrice?: Maybe<Scalars['Float']>;
  reason?: Maybe<Scalars['String']>;
  sellingPrices?: Maybe<Array<Maybe<UserOrderSellingPrices>>>;
  total?: Maybe<Scalars['Float']>;
};

export type UserOrderPriceTag = {
  __typename?: 'UserOrderPriceTag';
  identifier?: Maybe<Scalars['String']>;
  isPercentual?: Maybe<Scalars['Boolean']>;
  jurisCode?: Maybe<Scalars['String']>;
  jurisName?: Maybe<Scalars['String']>;
  jurisType?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  owner?: Maybe<Scalars['String']>;
  rate?: Maybe<Scalars['Float']>;
  rawValue: Scalars['Float'];
  value?: Maybe<Scalars['Float']>;
};

export type UserOrderRateAndBenefitsIdentifier = {
  __typename?: 'UserOrderRateAndBenefitsIdentifier';
  additionalInfo?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  featured?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
};

export type UserOrderRatesAndBenefitsData = {
  __typename?: 'UserOrderRatesAndBenefitsData';
  id?: Maybe<Scalars['String']>;
  rateAndBenefitsIdentifiers?: Maybe<Array<Maybe<UserOrderRateAndBenefitsIdentifier>>>;
};

export type UserOrderRestitutionItem = {
  __typename?: 'UserOrderRestitutionItem';
  compensationValue?: Maybe<Scalars['Float']>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  isCompensation?: Maybe<Scalars['Boolean']>;
  itemIndex?: Maybe<Scalars['Int']>;
  price?: Maybe<Scalars['Float']>;
  quantity?: Maybe<Scalars['Int']>;
  unitMultiplier?: Maybe<Scalars['Float']>;
  useFreight?: Maybe<Scalars['Boolean']>;
};

export type UserOrderRestitutionOption = {
  __typename?: 'UserOrderRestitutionOption';
  items?: Maybe<Array<UserOrderRestitutionItem>>;
  value?: Maybe<Scalars['Float']>;
};

export type UserOrderRestitutions = {
  __typename?: 'UserOrderRestitutions';
  GiftCard?: Maybe<UserOrderRestitutionOption>;
  Refund?: Maybe<UserOrderRestitutionOption>;
};

export type UserOrderResult = {
  __typename?: 'UserOrderResult';
  allowCancellation?: Maybe<Scalars['Boolean']>;
  canProcessOrderAuthorization?: Maybe<Scalars['Boolean']>;
  clientProfileData?: Maybe<UserOrderClientProfileData>;
  customData?: Maybe<UserOrderCustomData>;
  customFields?: Maybe<Array<Maybe<UserOrderCustomFieldsGrouped>>>;
  deliveryOptionsData?: Maybe<UserOrderDeliveryOptionsData>;
  items?: Maybe<Array<Maybe<UserOrderItems>>>;
  orderId?: Maybe<Scalars['String']>;
  paymentData?: Maybe<UserOrderPaymentData>;
  ruleForAuthorization?: Maybe<ProcessOrderAuthorizationRule>;
  shippingData?: Maybe<UserOrderShippingData>;
  status?: Maybe<Scalars['String']>;
  statusDescription?: Maybe<Scalars['String']>;
  storePreferencesData?: Maybe<UserOrderStorePreferencesData>;
  totals?: Maybe<Array<Maybe<UserOrderTotals>>>;
};

export type UserOrderSellingPrices = {
  __typename?: 'UserOrderSellingPrices';
  quantity?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['Float']>;
};

export type UserOrderShippingData = {
  __typename?: 'UserOrderShippingData';
  address?: Maybe<UserOrderAddress>;
  availableAddresses?: Maybe<Array<Maybe<UserOrderAddress>>>;
  contactInformation?: Maybe<Array<Maybe<UserOrderContactInformation>>>;
  id?: Maybe<Scalars['String']>;
  logisticsInfo?: Maybe<Array<Maybe<UserOrderLogisticsInfo>>>;
  selectedAddresses?: Maybe<Array<Maybe<UserOrderAddress>>>;
  trackingHints?: Maybe<Scalars['String']>;
};

export type UserOrderSlas = {
  __typename?: 'UserOrderSlas';
  availableDeliveryWindows?: Maybe<Array<Maybe<UserOrderDeliveryWindow>>>;
  deliveryChannel?: Maybe<Scalars['String']>;
  deliveryIds?: Maybe<Array<Maybe<UserOrderDeliveryIds>>>;
  deliveryWindow?: Maybe<UserOrderDeliveryWindow>;
  id?: Maybe<Scalars['String']>;
  listPrice?: Maybe<Scalars['Float']>;
  lockTTL?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  pickupDistance?: Maybe<Scalars['Int']>;
  pickupPointId?: Maybe<Scalars['String']>;
  pickupStoreInfo?: Maybe<UserOrderPickupStoreInfo>;
  polygonName?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  shippingEstimate?: Maybe<Scalars['String']>;
  shippingEstimateDate?: Maybe<Scalars['String']>;
  transitTime?: Maybe<Scalars['String']>;
};

export type UserOrderStorePreferencesData = {
  __typename?: 'UserOrderStorePreferencesData';
  countryCode?: Maybe<Scalars['String']>;
  currencyCode?: Maybe<Scalars['String']>;
  currencyFormatInfo?: Maybe<UserOrderCurrencyFormatInfo>;
  currencyLocale?: Maybe<Scalars['Int']>;
  currencySymbol?: Maybe<Scalars['String']>;
  timeZone?: Maybe<Scalars['String']>;
};

export type UserOrderStoreSellers = {
  __typename?: 'UserOrderStoreSellers';
  fulfillmentEndpoint?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type UserOrderTotals = {
  __typename?: 'UserOrderTotals';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Float']>;
};

export type UserOrderTrackingInformation = {
  __typename?: 'UserOrderTrackingInformation';
  city?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  lastChange?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
};

export type UserOrderTransactions = {
  __typename?: 'UserOrderTransactions';
  isActive?: Maybe<Scalars['Boolean']>;
  merchantName?: Maybe<Scalars['String']>;
  payments?: Maybe<Array<Maybe<UserOrderPayments>>>;
  transactionId?: Maybe<Scalars['String']>;
};

export type ValidateUserData = {
  __typename?: 'ValidateUserData';
  /** Indicates if the user is valid. */
  isValid: Scalars['Boolean'];
};
