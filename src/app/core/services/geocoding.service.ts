import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FeatureCollection, Geometry } from 'geojson';
import { OsmAddressFeatureProperties } from '../models/osm-address-feature-properties.model';
import { GeocodeResponseModel } from '../models/geocode-response.model';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  constructor(private readonly http: HttpClient) {
  }

  geocode(request: string) {
    return this.http.get<FeatureCollection<Geometry, OsmAddressFeatureProperties>>(`https://nominatim.openstreetmap.org/?q=${request}&format=geocodejson`)
  }

  reverse(lat: number, lon: number) {
    return this.http.get<GeocodeResponseModel>(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept_language=tr`)
  }
}
