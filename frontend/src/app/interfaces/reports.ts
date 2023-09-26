export interface Report {
  _id: string,
  userID: string,
  type: string,
  date: string,
  desc: string,
  location: string,
  lat: number,
  lon: number,
  file: string
}
