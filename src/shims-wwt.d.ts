import { Color, RenderContext } from "@wwtelescope/engine";

declare module "@wwtelescope/engine" {

  export class WebFile {
    constructor(url: string);
  }

  export class GlyphCache {
    constructor(glyphHeight: number);
    _texture: Texture;
    _webFile: WebFile;

    static getCache(height: number): GlyphCache;
  }

  export class Grids {
    static drawAltAzGrid(renderContext: RenderContext, opacity: number, drawColor: Color): void;
    static _makeAltAzGridText(): void;
    static _altAzTextBatch: Text3dBatch | null;
  }

  export class Text3dBatch {
    constructor(height: number);
    _glyphCache: GlyphCache;

    prepareBatch(): void;
  }

  export class Text3d {
    constructor(center: boolean, up: boolean, text: string, fontsize: number, scale: number);
  }

  export class Vector3d {
    static create(x: number, y: number, z: number): Vector3d;
  }

  export class Texture {
    static fromUrl(url: string): Texture;
  }

  export class PushPin {
    static getPushPinTexture(pinId: number): Texture;
  }

  export class Tile {
    static tilesInView: number;
    static tilesTouched: number;
    static deepestLevel: number;
  }

  export class RenderTriangle {}

  export class Planets {
    static _planetTextures: Texture[];

    // Technically this is a list of AstroRaDec objects, but this is a good enough definition
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static _planetLocations: { RA: number; dec: number }[];

    static drawPlanets(renderContext: RenderContext, opacity: number): void;
    static updatePlanetLocations(threeD: boolean): void;
    static _loadPlanetTextures(): void;
  }

  export class CAAMoon {
    static radiusVector(JD: number): number;
  }

}
