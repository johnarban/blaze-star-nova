// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/* eslint-disable */


import * as wwtlib from "@wwtelescope/engine";
import { Color, Coordinates, Matrix3d, RenderContext, SpaceTimeController } from "@wwtelescope/engine";
import { HorizonSkyOptions } from "./types";
import { horizontalToEquatorial } from "./annotations";
import { R2D } from "@cosmicds/vue-toolkit";


export const drawHorizon = (renderContext: RenderContext, options: HorizonSkyOptions) => {
  const zenithAltAz = new Coordinates(0, 0);
  const now = SpaceTimeController.get_now();
  const zenith = Coordinates.horizonToEquitorial(
    zenithAltAz,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    SpaceTimeController.get_location(),
    now,
  );

  const raPart = -((zenith.get_RA() + 6) / 24 * (Math.PI * 2));
  const decPart = -(zenith.get_dec() / 360 * (Math.PI * 2));

  const n = 6;
  const delta = 2 * Math.PI / n;
  const triangleList = new wwtlib.TriangleList();
  const color = Color.load(options.color);
  color.a = Math.round(255 * options.opacity ?? 1);
  for (let i = 0; i < n; i++) {
    let points: [number, number][] = [
      [0, i * delta],
      [-Math.PI / 2, i * delta],
      [0, (i + 1) * delta]
    ];
    points = points.map((point) => {
      const raDecRad = horizontalToEquatorial(...point, options.location.latitudeRad, options.location.longitudeRad, now);
      return Coordinates.raDecTo3d(R2D * raDecRad.raRad / 15, R2D * raDecRad.decRad);
    });
    triangleList.addSubdividedTriangles(...points, color, new wwtlib.Dates(0, 1), 2);
    
  }
  triangleList.draw(renderContext, 1, true);

};
