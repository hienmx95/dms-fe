import MarkerClusterer from '@googlemaps/markerclustererplus';
import { Model } from 'core/models';
import { Observable, Subject, Subscription } from 'rxjs';
export class GoogleMapServiceAutoComplete {
  map: any = null; // map instance
  bounds: google.maps.LatLngBounds = new google.maps.LatLngBounds(); // map boundary
  infoWindow: google.maps.InfoWindow = new google.maps.InfoWindow(); // map infoWindow
  markers: google.maps.Marker[] = []; // markers array
  cluster: MarkerClusterer;
  addCluster$: Subject<boolean> = new Subject();
  subscriptions: Subscription[] = [];
  searchBox: google.maps.places.SearchBox = new google.maps.places.SearchBox(
    document.getElementById('pac-input') as HTMLInputElement,
  );

  constructor(mapContainer: HTMLElement) {
    if (mapContainer) {
      this.map = new window.google.maps.Map(mapContainer, {
        styles: stylesMap,
        zoom: 16,
        center: {
          lat: 43.642567,
          lng: -79.387054,
        },
        mapTypeControl: false,
        // disableDefaultUI: true,
      });

      this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
        document.getElementById('pac-input'),
      );
      google.maps.event.addListener(this.searchBox, 'places_changed', () => {
        this.searchBox.set('map', null);
      });
    } // initiate mapService with map instance
  }
  unSubscribe = () => {
    this.subscriptions.forEach(item => item.unsubscribe());
  };

  setCluster = () => {
    this.addCluster$.next(true);
  }; // trigger addCluster

  _getCluster = () => {
    return this.addCluster$ as Observable<boolean>;
  };

  addCluster = (isSet: boolean) => {
    if (isSet) {
      // tslint:disable-next-line:no-unused-expression
      this.cluster = new MarkerClusterer(this.map, this.markers, {
        styles: clusterStyle,
        clusterClass: 'custom-clustericon',
        gridSize: 40,
        maxZoom: 15,
      });
      this.cluster.fitMapToMarkers(10);
    }
  };

  clearClusters = () => {
    this.cluster.clearMarkers();
    this.markers = [];
  };

  setMarkersOnMap = (map: any) => {
    if (this.markers.length > 0) {
      for (const item of this.markers) {
        item.setMap(map);
      }
    }
  }; // clear all markers on map instance

  clearMarkers = () => {
    this.setMarkersOnMap(null);
    this.markers = []; // reset
  }; // Shows any markers currently in the array

  addMarkers = <T extends Model>(
    places: T[],
    renderInfoWindow: (place: T) => string,
  ) => {
    places.forEach(place => {
      const lat = place.latitude;
      const lng = place.longitude;
      const icon = place.markerIcon;
      const zIndex = place.zIndex;
      if (typeof lat === 'number' && typeof lng === 'number') {
        // tslint:disable-next-line:no-unused-expression
        const marker = new google.maps.Marker({
          position: { lat, lng },
          icon,
          zIndex,
        });
        // marker.bindTo('map', this.searchBox, 'map');
        this.bounds.extend({ lat, lng }); // extends map bounds
        this.markers.push(marker); // add marker to markers array
        marker.addListener('click', () => {
          this.infoWindow.setContent(renderInfoWindow(place));
          this.infoWindow.open(this.map, marker);
        });
      }
    });
    this.map.fitBounds(this.bounds); // fitbounds all markers
  }; // create markers from deriver places
  addSearchValue = () => {
    this.searchBox.addListener('places_changed', () => {
      const places = this.searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }
      // Clear out the old markers.
      this.markers.forEach(marker => {
        marker.setMap(null);
      });
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
      places.forEach(place => {
        if (!place.geometry || !place.geometry.location) {
          return;
        }

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });
  };
}

const clusterStyle = [
  {
    width: 30,
    height: 30,
    className: 'custom-clustericon-1',
  },
  {
    width: 40,
    height: 40,
    className: 'custom-clustericon-2',
  },
  {
    width: 50,
    height: 50,
    className: 'custom-clustericon-3',
  },
];

const stylesMap: any[] = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];
