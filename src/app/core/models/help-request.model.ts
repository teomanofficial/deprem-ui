export interface HelpRequestModel {
  id: string;
  address: string;
  description: string;
  location: { lat: number, lon: number };
}
