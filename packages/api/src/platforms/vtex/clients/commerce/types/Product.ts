export interface PortalProduct {
  productId: string;
  productName: string;
  brand: string;
  brandId: number;
  brandImageUrl: null | string;
  linkText: string;
  productReference: string;
  productReferenceCode: string;
  categoryId: string;
  productTitle: string;
  metaTagDescription: string;
  releaseDate: Date;
  clusterHighlights: unknown;
  productClusters: unknown;
  searchableClusters: unknown;
  categories: Category[];
  categoriesIds: CategoriesId[];
  link: string;
  description: string;
  items: Item[];
}

enum Category {
  Office = "/Office/",
  OfficeChairs = "/Office/Chairs/",
}

enum CategoriesId {
  The9282 = "/9282/",
  The92829296 = "/9282/9296/",
}



interface Item {
  itemId: string;
  name: string;
  nameComplete: string;
  complementName: string;
  ean: string;
  referenceId: ReferenceId[];
  measurementUnit: MeasurementUnit;
  unitMultiplier: number;
  modalType: null;
  isKit: boolean;
  images: Image[];
  sellers: Seller[];
  videos: unknown[];
  estimatedDateArrival: null;
}

interface Image {
  imageId: string;
  imageLabel: string;
  imageTag: string;
  imageUrl: string;
  imageText: string;
  imageLastModified: Date;
}

enum MeasurementUnit {
  Un = "un",
}

interface ReferenceId {
  key: Key;
  value: string;
}

enum Key {
  RefId = "RefId",
}

interface Seller {
  sellerId: string;
  sellerName: SellerName;
  addToCartLink: string;
  sellerDefault: boolean;
  commertialOffer: CommertialOffer;
}

interface CommertialOffer {
  deliverySlaSamplesPerRegion: DeliverySlaSamplesPerRegion;
  installments: Installment[];
  discountHighLight: unknown[];
  giftSkuIds: unknown[];
  teasers: unknown[];
  buyTogether: unknown[];
  itemMetadataAttachment: unknown[];
  price: number;
  listPrice: number;
  priceWithoutDiscount: number;
  rewardValue: number;
  priceValidUntil: Date;
  availableQuantity: number;
  isAvailable: boolean;
  tax: number;
  deliverySlaSamples: DeliverySlaSample[];
  getInfoErrorMessage: null;
  cacheVersionUsedToCallCheckout: string;
  paymentOptions: PaymentOptions;
}

interface DeliverySlaSample {
  deliverySlaPerTypes: unknown[];
  region: null;
}

interface DeliverySlaSamplesPerRegion {
  the0: DeliverySlaSample;
}

interface Installment {
  value: number;
  interestRate: number;
  totalValuePlusInterestRate: number;
  numberOfInstallments: number;
  paymentSystemName: PaymentSystemNameEnum;
  paymentSystemGroupName: GroupName;
  name: Name;
}

enum Name {
  BoletoBancárioÀVista = "Boleto Bancário à vista",
  FreeÀVista = "Free à vista",
}

enum GroupName {
  BankInvoicePaymentGroup = "bankInvoicePaymentGroup",
  Custom201PaymentGroupPaymentGroup = "custom201PaymentGroupPaymentGroup",
}

enum PaymentSystemNameEnum {
  BoletoBancário = "Boleto Bancário",
  Free = "Free",
}

interface PaymentOptions {
  installmentOptions: InstallmentOption[];
  paymentSystems: PaymentSystem[];
  payments: unknown[];
  giftCards: unknown[];
  giftCardMessages: unknown[];
  availableAccounts: unknown[];
  availableTokens: unknown[];
}

interface InstallmentOption {
  paymentSystem: string;
  bin: null;
  paymentName: PaymentSystemNameEnum;
  paymentGroupName: GroupName;
  value: number;
  installments: InstallmentElement[];
}

interface InstallmentElement {
  count: number;
  hasInterestRate: boolean;
  interestRate: number;
  value: number;
  total: number;
  sellerMerchantInstallments?: InstallmentElement[];
  id?: Id;
}

enum Id {
  Storeframework = "STOREFRAMEWORK",
}

interface PaymentSystem {
  id: number;
  name: PaymentSystemNameEnum;
  groupName: GroupName;
  validator: null;
  stringId: string;
  template: Template;
  requiresDocument: boolean;
  isCustom: boolean;
  description: Description | null;
  requiresAuthentication: boolean;
  dueDate: Date;
  availablePayments: null;
}

enum Description {
  FreePayToTestCheckoutPayments = "Free pay to test checkout payments",
}

enum Template {
  BankInvoicePaymentGroupTemplate = "bankInvoicePaymentGroup-template",
  Custom201PaymentGroupPaymentGroupTemplate =
    "custom201PaymentGroupPaymentGroup-template",
}

enum SellerName {
  Vtex = "VTEX",
}
