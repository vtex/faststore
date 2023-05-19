export interface ShippingDataBody {
    clearAddressIfPostalCodeNotFound?: boolean;
    selectedAddresses?: SelectedAddress[];
    logisticsInfo?: LogisticsInfo[];
}

export interface SelectedAddress {
    addressType?: string | null;
    receiverName?: string | null;
    postalCode?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    street?: string | null;
    number?: string | null;
    neighborhood?: string | null;
    complement?: string | null;
    reference?: string | null;
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
