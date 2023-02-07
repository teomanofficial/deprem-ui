import { Icon, LatLng, Marker } from 'leaflet';

export function createMarker(lat: number, lon: number) {
  return new Marker(new LatLng(lat, lon), {
    icon: new Icon({
      iconUrl: 'assets/images/location-pin-green.png',
      iconSize: [40, 40]
    })
  });
}
export function createMarkerFromLatLng(latlng: LatLng) {
  return new Marker(latlng, {
    icon: new Icon({
      iconUrl: 'assets/images/location-pin-green.png',
      iconSize: [40, 40]
    })
  });
}

export function createRegisteredMarker(lat: number, lon: number) {
  return new Marker(new LatLng(lat, lon), {
    icon: new Icon({
      iconUrl: 'assets/images/location-pin.png',
      iconSize: [40, 40]
    })
  });
}
