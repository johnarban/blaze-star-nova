// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/* eslint-disable */

import { Constellations, Coordinates, Grids, Settings, SpaceTimeController, Text3d, Text3dBatch, Vector3d, WebFile, WWTControl } from "@wwtelescope/engine";

export function makeAltAzGridText() {
  if (Grids._altAzTextBatch == null) {
    const glyphHeight = 70;
    Grids._altAzTextBatch = new Text3dBatch(glyphHeight);
    const sign = SpaceTimeController.get_location().get_lat() < 0 ? -1 : 1;
    const alt = 0.03 * sign;
    const up = Vector3d.create(0, sign, 0);
    const directions = [
      [[0, alt, -1], "N"],
      [[-sign, alt, 0], "E"],
      [[0, alt, 1], "S"],
      [[sign, alt,  -0.0095], "V"],
      [[sign, alt,  0.0095], "V"]
    ]
    directions.forEach(([v, text]) => {
      Grids._altAzTextBatch.add(new Text3d(Vector3d.create(...v), up, text, 75, 0.00018));
    });
  }
}

export function initializeConstellationNames() {
  if (Constellations.constellationCentroids == null) {
      return;
  }
  Constellations._namesBatch = new Text3dBatch(Settings.get_active().get_constellationLabelsHeight());
  const keep = ["BOO", "CRB"];
  for (const constellation of Object.keys(Constellations.constellationCentroids)) {
      
      if (!keep.includes(constellation)) {
        continue;
      }

      const centroid = Constellations.constellationCentroids[constellation];
      const center = Coordinates.raDecTo3dAu(centroid.get_RA(), centroid.get_dec(), 1);
      const up = Vector3d.create(0, 1, 0);
      const name = centroid.get_name();
      if (centroid.get_name() === 'Triangulum Australe') {
          name = ss.replaceString(name, ' ', '\n   ');
      }
      Constellations._namesBatch.add(new Text3d(center, up, name, Settings.get_active().get_constellationLabelsHeight(), 0.000125));
  }
}

export function setupConstellationFigures() {
  WWTControl.constellationsFigures.draw = function (renderContext, showOnlySelected, focusConstellation, clearExisting) {
    const keep = ["BOO", "CRB"];
    Constellations._maxSeperation = Math.max(0.6, Math.cos((renderContext.get_fovAngle() * 2) / 180 * Math.PI));
    this._drawCount = 0;
    var lsSelected = null;
    if (this.lines == null || Constellations.constellationCentroids == null) {
        return;
    }
    Constellations._constToDraw = focusConstellation;
    for (const ls of this.lines) {
        const name = ls.get_name();
        if (!keep.includes(name)) {
          continue;
        }
        if (Constellations._constToDraw === name && this._boundry) {
            lsSelected = ls;
        }
        else if (!showOnlySelected || !this._boundry) {
            this._drawSingleConstellation(renderContext, ls, 1);
        }
    }
    if (lsSelected != null) {
        this._drawSingleConstellation(renderContext, lsSelected, 1);
    }
  }.bind(WWTControl.constellationsFigures);
}

export function useCustomGlyphs(batch: Text3dBatch) {
  const cache = batch._glyphCache;
  const origin = window.location.origin;
  const imageUrl = `${origin}/
  const imageUrl = require("./assets/glyphs2.png");
  const xmlUrl = require("./assets/glyphs2.xml");
  console.log(imageUrl);
  console.log(xmlUrl);
  cache._texture = Texture.fromUrl(imageUrl);
  cache._webFile = new WebFile(xmlUrl);
}
