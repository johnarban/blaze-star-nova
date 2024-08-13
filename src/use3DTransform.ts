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
} from "@wwtelescope/engine";

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export function use3DTransform() {
    
  function transformWorldPointToPickSpace3D(worldPoint: any, backBufferWidth: number, backBufferHeight: number): Vector3D {
    const m = Matrix3d.multiplyMatrix(this.renderContext.get_world(), this.renderContext.get_view());
    const p = new Vector3d();
    const vz = worldPoint.x * m.get_m13() + worldPoint.y * m.get_m23() + worldPoint.z * m.get_m33();
    const vx = (worldPoint.x * m.get_m11() + worldPoint.y * m.get_m21() + worldPoint.z * m.get_m31()) / vz;
    const vy = -(worldPoint.x * m.get_m12() + worldPoint.y * m.get_m22() + worldPoint.z * m.get_m32()) / vz;
    p.x = Math.round((1 + this.renderContext.get_projection().get_m11() * vx) * (backBufferWidth / 2));
    p.y = Math.round((1 + this.renderContext.get_projection().get_m22() * vy) * (backBufferHeight / 2));
    p.z = Math.round((1 + this.renderContext.get_projection().get_m33() * vz) / 2);
    return p;
  }


  function getScreenPointForCoordinates3D(ra, dec): Vector3D {
    const pt = Vector2d.create(ra, dec);
    const cartesian = Coordinates.sphericalSkyToCartesian(pt);
    const result = transformWorldPointToPickSpace3D.bind(this)(cartesian, this.renderContext.width, this.renderContext.height);
    return result;
  }

    /** Given an RA and Dec position, return the x, y, z coordinates of the screen point.
    
    z === 1 means it is on the screen. z===0 is mirror point */
  function findScreenPointForRADec3D(pt: {ra: number, dec: number}): Vector3D {
    return getScreenPointForCoordinates3D.bind(this)(pt.ra / 15, pt.dec);
  }
  
  function findScreenPointForRADec(pt: {ra: number, dec: number}) {
    return findScreenPointForRADec3D.bind(WWTControl.singleton)(pt);
  }
  
  
  return { findScreenPointForRADec };
}
  
