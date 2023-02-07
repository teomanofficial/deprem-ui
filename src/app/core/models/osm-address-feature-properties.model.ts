export interface OsmAddressFeatureProperties {
  geocoding: {
    place_id: number;
    osm_type: string;
    osm_id: number;
    display_name: string;
    place_rank: number;
    category: string;
    type: string;
    importance: number;
  }
}
