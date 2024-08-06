// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/* eslint-disable */

import { Color, Constellations, Coordinates, Grids, Settings, SimpleLineList, SpaceTimeController, Text3d, Text3dBatch, Texture, Vector3d, WebFile, WWTControl } from "@wwtelescope/engine";

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

function drawSingleConstellation(renderContext, ls, opacity, color=null) {
  const reverse = false;
  const name = ls.get_name();
  const centroid = Constellations.constellationCentroids[name];
  if (centroid != null) {
      var pos = Coordinates.raDecTo3d((reverse) ? -centroid.get_RA() - 6 : centroid.get_RA(), (reverse) ? centroid.get_dec() : centroid.get_dec());
      if (Vector3d.dot(renderContext.get_viewPoint(), pos) < Constellations._maxSeperation) {
          return;
      }
  }
  if (!(name in this._constellationVertexBuffers)) {
    var count = ls.points.length;
    var linelist = new SimpleLineList();
    linelist.set_depthBuffered(false);
    this._constellationVertexBuffers[name] = linelist;
    var currentPoint = new Vector3d();
    var temp;
    for (var i = 0; i < count; i++) {
        if (!ls.points[i].pointType || !i) {
            currentPoint = Coordinates.raDecTo3d(ls.points[i].RA, ls.points[i].dec);
        }
        else {
            temp = Coordinates.raDecTo3d(ls.points[i].RA, ls.points[i].dec);
            linelist.addLine(currentPoint, temp);
            currentPoint = temp;
        }
    }
    if (this._boundry) {
        temp = Coordinates.raDecTo3d(ls.points[0].RA, ls.points[0].dec);
        linelist.addLine(currentPoint, temp);
    }
  }
  var col = 'red';
  if (this._boundry) {
      if (Constellations._constToDraw !== name) {
          col = Settings.get_globalSettings().get_constellationBoundryColor();
      }
      else {
          col = Settings.get_globalSettings().get_constellationSelectionColor();
      }
  } else {
      col = color ?? Settings.get_globalSettings().get_constellationFigureColor();
  }
  this._constellationVertexBuffers[name].drawLines(renderContext, opacity, Color.load(col));
}


function drawConstellations(renderContext, showOnlySelected, focusConstellation, clearExisting) {
    const highlight = ["BOO", "CRB"];
    const highlightColor = "#ffff00";
    Constellations._maxSeperation = Math.max(0.6, Math.cos((renderContext.get_fovAngle() * 2) / 180 * Math.PI));
    this._drawCount = 0;
    var lsSelected = null;
    if (this.lines == null || Constellations.constellationCentroids == null) {
        return;
    }
    Constellations._constToDraw = focusConstellation;
    for (const ls of this.lines) {
        const name = ls.get_name();
        const highlighted = highlight.includes(name);
        const color = highlighted ? highlightColor : null;
        if (Constellations._constToDraw === name && this._boundry) {
            lsSelected = ls;
        }
        else if (!showOnlySelected || !this._boundry) {
            this._drawSingleConstellation(renderContext, ls, 1, color);
        }
    }
    if (lsSelected != null) {
        this._drawSingleConstellation(renderContext, lsSelected, 1, color);
    }
  }


export function setupConstellationFigures() {
  console.log(WWTControl.constellationsFigures);
  console.log(WWTControl.constellationsFigures._constellationVertexBuffers);
  WWTControl.constellationsFigures._drawSingleConstellation = drawSingleConstellation.bind(WWTControl.constellationsFigures);
  WWTControl.constellationsFigures.draw = drawConstellations.bind(WWTControl.constellationsFigures);
}

export function useCustomGlyphs(batch: Text3dBatch) {
  batch.prepareBatch();
  console.log(batch._glyphCache);
  const cache = batch._glyphCache;
  const origin = window.location.origin;
  const imageUrl = `${origin}/glyphs2.png`;
  const xmlUrl = `${origin}/glyphs2.xml`;
  cache._texture = Texture.fromUrl(imageUrl);
  cache._webFile = new WebFile(xmlUrl);
}
