import { D2R, R2D } from "@cosmicds/vue-toolkit";
import { Poly, WWTControl } from "@wwtelescope/engine";
import { Annotation2, Poly2 } from "./Annotation2";
import { HorizonSkyOptions, HorizontalRad, EquatorialRad } from "./types";

// WWT does have all of this functionality built in
// but it doesn't seem to be exposed
// We should do that, but for now we just copy the web engine code
// https://github.com/Carifio24/wwt-webgl-engine/blob/master/engine/wwtlib/Coordinates.cs
export function altAzToHADec(altRad: number, azRad: number, latRad: number): { ra: number; dec: number; } {
  azRad = Math.PI - azRad;
  if (azRad < 0) {
    azRad += 2 * Math.PI;
  }
  let ra = Math.atan2(Math.sin(azRad), Math.cos(azRad) * Math.sin(latRad) + Math.tan(altRad) * Math.cos(latRad));
  if (ra < 0) {
    ra += 2 * Math.PI;
  }
  const dec = Math.asin(Math.sin(latRad) * Math.sin(altRad) - Math.cos(latRad) * Math.cos(altRad) * Math.cos(azRad));
  return { ra, dec };
}

export function getJulian(utc: Date): number {
  let year = utc.getUTCFullYear();
  let month = utc.getUTCMonth()+1;
  const day = utc.getUTCDate();
  const hour = utc.getUTCHours();
  const minute = utc.getUTCMinutes();
  const second = utc.getUTCSeconds() + utc.getUTCMilliseconds() / 1000.0;

  if (month == 1 || month == 2)
  {
    year -= 1;
    month += 12;
  }

  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4.0);
  const c = Math.floor(365.25 * year);
  const d = Math.floor(30.6001 * (month + 1));

  // gives julian date: number of days since Jan 1, 4713 BC
  const jd = b + c + d + 1720994.5 + day + (hour + minute / 60.00 + second / 3600.00) / 24.00;
  return jd;
}

export function mstFromUTC2(utc: Date, longRad: number): number {
  const lng = longRad * R2D;

  const modifiedJD = getJulian(utc)  - 2451545;

  const julianCenturies = modifiedJD / 36525.0;
  // this form wants julianDays - 2451545
  let mst = 280.46061837 + 360.98564736629 * modifiedJD + 0.000387933 * julianCenturies * julianCenturies - julianCenturies * julianCenturies * julianCenturies / 38710000 + lng;

  if (mst > 0.0) {
    while (mst > 360.0) {
      mst = mst - 360.0;
    }
  } else {
    while (mst < 0.0) {
      mst = mst + 360.0;
    }
  }

  return mst;
}

export function horizontalToEquatorial(altRad: number, azRad: number, latRad: number, longRad: number, utc: Date): EquatorialRad {
  const st = mstFromUTC2(utc, longRad); // siderial time 

  const haDec = altAzToHADec(altRad, azRad, latRad); // get Hour Angle and Declination
  
  const ha = haDec.ra * R2D;

  let ra = st + ha;
  if (ra < 0) {
    ra += 360;
  }
  if (ra > 360) {
    ra -= 360;
  }
  // ra -= 180;
  // console.log(`Alt: ${(altRad*R2D).toFixed(2)} Az: ${(azRad*R2D).toFixed(2)} Ra: ${ra.toFixed(2)} Dec: ${(haDec.dec*R2D).toFixed(2)}`)

  return { raRad: D2R * ra, decRad: haDec.dec };
}

export function equatorialToHorizontal(raRad: number, decRad: number, latRad: number, longRad: number, utc: Date): HorizontalRad {
  let hourAngle = mstFromUTC2(utc, longRad) - R2D * raRad;
  if (hourAngle < 0) {
    hourAngle += 360;
  }

  const ha = D2R * hourAngle;
  const dec = decRad;
  const lat = latRad;
  
  const sinAlt = Math.sin(dec) * Math.sin(lat) + Math.cos(dec) * Math.cos(lat) * Math.cos(ha);
  const altitude = Math.asin(sinAlt);
  const cosAz = (Math.sin(dec) - Math.sin(altitude) * Math.sin(lat)) / (Math.cos(altitude) * Math.cos(lat));
  let azimuth = Math.acos(cosAz);

  azimuth = azimuth + (Math.PI * 80) % (Math.PI * 2);

  if (Math.sin(ha) > 0) {
    azimuth = 2 * Math.PI - azimuth;
  }
  return { altRad: altitude, azRad: azimuth };

}

export function createHorizon(options: HorizonSkyOptions): Poly[] {
  const date = options.when || new Date();

  // The initial coordinates are given in Alt/Az, then converted to RA/Dec
  // Use N annotations to cover below the horizon
  const n = 6;
  const delta = 2 * Math.PI / n;
  const color = options.color ?? "#01362C";
  const opacity = options.opacity ?? 1;

  const pieces: Poly[] = [];
  for (let i = 0; i < n; i++) {
    let points: [number, number][] = [
      [0, i * delta],
      [-Math.PI / 2, i * delta],
      [0, (i + 1) * delta]
    ];
    points = points.map((point) => {
      const raDec = horizontalToEquatorial(...point, options.location.latitudeRad, options.location.longitudeRad, date);
      return [R2D * raDec.raRad, R2D * raDec.decRad];
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const poly = new Poly2();
    points.forEach(point => poly.addPoint(...point));
    poly.set_lineColor(color);
    poly.set_fill(true);
    poly.set_fillColor(color);
    poly.set_opacity(opacity);
    poly.set_lineWidth(0); // This removes the seam that appears between the polygons when opacity < 1

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Annotation2.addAnnotation(poly);
    pieces.push(poly);
  }

  return pieces;
}

export function removeHorizon() {
  Annotation2.clearAll();
}

export function createSky(options: HorizonSkyOptions): Poly[] {
  const color = options.color ?? "#4190ED";
  const date = options.when || new Date();
  const opacity = options.opacity ?? 1;

  // The initial coordinates are given in Alt/Az, then converted to RA/Dec
  // Use N annotations to cover below the horizon
  const n = 6;
  const delta = 2 * Math.PI / n;
  // const delta = 360/n;
  
  const pieces: Poly[] = [];
  for (let i = 0; i < n; i++) {
    let points: [number, number][] = [
      [0, i * delta],
      [0, (i + 1) * delta],
      [Math.PI / 2, i * delta] // In addition to using +pi/2 instead of -pi/2, I had to switch the order of the 2nd & 3rd points relative to the horizon set. I don't know why, but before I switched them, the polygons didn't render.
    ];
    points = points.map((point) => {
      const raDec = horizontalToEquatorial(...point, options.location.latitudeRad, options.location.longitudeRad, date);
      return [R2D * raDec.raRad, R2D * raDec.decRad];
    });
    const poly = new Poly();
    points.forEach(point => poly.addPoint(...point));
    poly.set_fill(true);
    poly.set_fillColor(color);
    poly.set_opacity(opacity);
    poly.set_lineWidth(0); // This removes the seam that appears between the polygons when opacity < 1
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    WWTControl.scriptInterface.addAnnotation(poly);
    pieces.push(poly);
  }

  return pieces;
}

