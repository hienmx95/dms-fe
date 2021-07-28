import React from 'react';
import { IPlace } from './GoogleMap';
import { Marker } from 'google-maps-react';
export interface MarkerViewProps extends Partial<google.maps.MarkerOptions> {
  key?: string;
  place_?: IPlace;
  position?: google.maps.LatLng | google.maps.LatLngLiteral;
  onClick?: (props, marker) => void;
}
export default function MarkerView(props: MarkerViewProps) {
  return <Marker {...props} />;
}
