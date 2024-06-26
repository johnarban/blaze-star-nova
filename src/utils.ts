export interface LocationRad {
  longitudeRad: number;
  latitudeRad: number;
}

export interface HorizonOptions {
  when?: Date;
  location: LocationRad;
  color?: string;
  opacity?: number;
}
