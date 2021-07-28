import { GoogleAPI, GoogleApiWrapper, Map } from 'google-maps-react';
import React from 'react';
// import InfoWindowView from './InfoWindowView';
// import { translate } from 'core/helpers/internationalization';
import Marker from './Marker';

export interface IPlace {
  key?: string;
  name?: string;
  latitude?: number;
  longitude?: number;
  storeName?: string;
  address?: string;
  checkIn?: string;
  checkOut?: string;
  saleOrders?: string[];
  storeProblems?: string[];
  storeCompetitors?: string[];
  imagesUrl?: string;
}

export interface MapContainerProps {
  defaultAddress?: string; // default value for autocomplate
  defaultZoom?: number; // default zoom for map
  google: GoogleAPI; // google Api instance for map
  inputClassName?: string;
  inputMapClassName?: string;
  center?: any;
  places?: IPlace[];
  onMarkerClick?: (props: any, marker: any) => void;
  children?: React.ReactNode;
}

interface MapContainerState {
  showingInfoWindow: boolean;
  activeMarker: any;
  selectedPlace: IPlace;
}

export class MapContainer extends React.Component<
  MapContainerProps,
  MapContainerState
> {
  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {
        saleOrders: [],
        storeProblems: [],
        storeCompetitors: [],
      } as IPlace,
    };
  }

  onMarkerClick = (props, marker) => {
    this.setState({
      selectedPlace: props.place_,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  };

  render() {
    const { google, center, defaultZoom, places } = this.props;
    return (
      <div className="map-container">
        <Map google={google} zoom={defaultZoom} initialCenter={center}>
          {places &&
            places.map(place => {
              return (
                <Marker
                  key={place.key}
                  place_={place}
                  position={{ lat: place.latitude, lng: place.longitude }}
                  onClick={this.onMarkerClick}
                />
              );
            })}
          {/* <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          /> */}
          {/* <div style={{ minWidth: 200 }}>
              <h3>{this.state.selectedPlace.storeName}</h3>
              <p>{this.state.selectedPlace.address}</p>
              <p>
                <span>Checkin: </span>
                {this.state.selectedPlace.checkIn}
              </p>
              <p>
                <span>CheckOut: </span>
                {this.state.selectedPlace.checkOut}
              </p>
              <p>
                <span>{translate('maps.saleOrder')}</span>
                <ul>
                  {this.state.selectedPlace.saleOrders.length > 0 &&
                    this.state.selectedPlace.saleOrders.map(order => (
                      <li key={order}>{order}</li>
                    ))}
                </ul>
              </p>
              <p>
                <span>{translate('maps.storeProblems')}</span>
                <ul>
                  {this.state.selectedPlace.storeProblems.length > 0 &&
                    this.state.selectedPlace.storeProblems.map(problem => (
                      <li key={problem}>{problem}</li>
                    ))}
                </ul>
              </p>
              <p>
                <span>{translate('maps.storeCompetitors')}</span>
                <ul>
                  {this.state.selectedPlace.storeCompetitors.length > 0 &&
                    this.state.selectedPlace.storeCompetitors.map(
                      competitor => <li key={competitor}>{competitor}</li>,
                    )}
                </ul>
              </p>
              <p>
                <span>{translate('maps.storeProblems')}</span>
                <ul>{}</ul>
              </p>
            </div> */}
          {this.props.children}
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_APIKEY,
  libraries: ['places'],
})(MapContainer);
