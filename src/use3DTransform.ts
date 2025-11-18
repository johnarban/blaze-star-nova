// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/* eslint-disable */

import {
  Coordinates,
  Settings,
  Vector3d,
  Vector2d,
  Matrix3d,
  WWTControl,
  RenderContext
} from "@wwtelescope/engine";

interface RenderContextExt extends RenderContext {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  get_world: () => Matrix3d;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  get_view: () => Matrix3d;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  get_projection: () => Matrix3d;

}

export type Vector3d = Vector3d;

export function use3DTransform() {
  
  const rc = WWTControl.singleton.renderContext as unknown as RenderContextExt;
    
  function transformWorldPointToPickSpace3D(worldPoint: Vector2d, backBufferWidth: number, backBufferHeight: number): Vector3d {
    const m = Matrix3d.multiplyMatrix(rc.get_world(), rc.get_view());
    const p = new Vector3d();
    const vz = worldPoint.x * m.get_m13() + worldPoint.y * m.get_m23() + worldPoint.z * m.get_m33();
    const vx = (worldPoint.x * m.get_m11() + worldPoint.y * m.get_m21() + worldPoint.z * m.get_m31()) / vz;
    const vy = -(worldPoint.x * m.get_m12() + worldPoint.y * m.get_m22() + worldPoint.z * m.get_m32()) / vz;
    p.x = Math.round((1 + rc.get_projection().get_m11() * vx) * (backBufferWidth / 2));
    p.y = Math.round((1 + rc.get_projection().get_m22() * vy) * (backBufferHeight / 2));
    p.z = Math.round((1 + rc.get_projection().get_m33() * vz) / 2);
    return p;
  }


  function getScreenPointForCoordinates3D(ra, dec): Vector3d {
    const pt = Vector2d.create(ra, dec);
    const cartesian = Coordinates.sphericalSkyToCartesian(pt);
    const result = transformWorldPointToPickSpace3D(cartesian, rc.width, rc.height);
    return result;
  }

  /** Given an RA and Dec position, return the x, y, z coordinates of the screen point.
    
    z === 1 means it is on the screen. z===0 is mirror point */
  function findScreenPointForRADec3D(pt: {ra: number, dec: number}): Vector3d {
    return getScreenPointForCoordinates3D(pt.ra / 15, pt.dec);
  }
  

  
  
  return { findScreenPointForRADec3D };
}
  
