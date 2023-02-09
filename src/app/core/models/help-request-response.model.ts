export interface HelpRequestResponseModel {
  id: number;
  objectId: string;
  address: string;
  description: string;
  date: string;
  timeSpan: string;
  location: {
    lat: number;
    lon: number;
  },
  status: number;
  createdAt: string;
}
