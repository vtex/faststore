export interface IncrementedAddress {
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
