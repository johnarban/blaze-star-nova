// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/* eslint-disable */

import { Coordinates, Text3d, Text3dBatch, Vector3d } from "@wwtelescope/engine";

export function makeTextOverlays(): Text3dBatch {
  const glyphHeight = 75 * 0.8;
  const scale = 0.00018;
  const batch = new Text3dBatch(glyphHeight);
  const up = Vector3d.create(0, 1, 0);
  const textItems = [
    "Blaze Star",
    "Nova will be roughly this bright",
  ];
  const locations = [
    Coordinates.raDecTo3d(15 + 59 / 60 + 30.1622 / 3600, 25 + 55 / 60 + 12.613 / 3600),
    Coordinates.raDecTo3d(15 + 34 / 60 + 41.268 / 3600, 26 + 42 / 60 + 52.89 / 3600),
  ];

  textItems.forEach((item, index) => {
    batch.add(new Text3d(locations[index], up, item, glyphHeight, scale));
  });

  return batch;
}
