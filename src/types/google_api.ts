export interface GeocodeResponse {
  results: GeocodeResult[];
  status: string;
}

export interface GeocodeResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code?: PlusCode;
  types: string[];
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface Geometry {
  location: LatLngLiteral;
  location_type: string;
  viewport: Viewport;
}

export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export interface Viewport {
  northeast: LatLngLiteral;
  southwest: LatLngLiteral;
}

export interface PlusCode {
  compound_code: string;
  global_code: string;
}
