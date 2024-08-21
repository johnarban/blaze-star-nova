// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/* eslint-disable */

import { Coordinates, Text3d, Text3dBatch, Vector3d } from "@wwtelescope/engine";

export function makeTextOverlays(): Text3dBatch[] {
  const glyphHeight = 75 * 0.5;
  const scale = 0.00018;
  const textItems = [
    ["T CrB, aka", "Blaze Star"],
    ["Alphecca", "(Nova will", "become roughly", "this bright)"],
  ];
  const up = Vector3d.create(0, 1, 0);
  const locations = [
    [
      Coordinates.raDecTo3d(15 + 59 / 60 + 30.1622 / 3600, 24 + 55 / 60 + 12.613 / 3600),
      Coordinates.raDecTo3d(15 + 59 / 60 + 30.1622 / 3600, 23 + 40 / 60 + 12.613 / 3600),
    ],
    [
      Coordinates.raDecTo3d(15 + 24 / 60 + 41.268 / 3600, 25 + 42 / 60 + 52.89 / 3600),
      Coordinates.raDecTo3d(15 + 24 / 60 + 41.268 / 3600, 24 + 17 / 60 + 52.89 / 3600),
      Coordinates.raDecTo3d(15 + 24 / 60 + 41.268 / 3600, 23 + 2 / 60 + 52.89 / 3600),
      Coordinates.raDecTo3d(15 + 24 / 60 + 41.268 / 3600, 21 + 47 / 60 + 52.89 / 3600),
    ]
  ];
  const batches = textItems.map(items => new Text3dBatch(glyphHeight));
  textItems.forEach((items, index) => {
    const batch = batches[index];
    const locs = locations[index];
    items.forEach((item, idx) => batch.add(new Text3d(locs[idx], up, item, glyphHeight, scale)));
  });

  return batches;
}
