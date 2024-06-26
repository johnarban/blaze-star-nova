export interface LocationRad {
  longitudeRad: number;
  latitudeRad: number;
}

export interface HorizonOptions {
  location: LocationRad;
  when?: Date;
  color?: string;
  opacity?: number;
}

export interface HorizontalRad {
  altRad: number;
  azRad: number;
}

export interface EquatorialRad {
  raRad: number;
  decRad: number;
}
