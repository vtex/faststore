export interface ShippingDataBody {
    clearAddressIfPostalCodeNotFound?: boolean;
    selectedAddresses?: SelectedAddress[];
    logisticsInfo?: LogisticsInfo[];
}

export interface SelectedAddress {
    addressType?: string;
    receiverName?: string;
    postalCode?: string | null;
    city?: string;
    state?: string;
    country?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    complement?: string;
    reference?: string;
    geoCoordinates?: GeoCoordinates | null | [];
}

export interface GeoCoordinates {
    latitude: GLfloat;
    longitude: GLfloat;
}

export interface LogisticsInfo {
    itemIndex?: number;
    selectedDeliveryChannel?: string;
    selectedSla?: string;
}
