// Types and Interfaces


export type ScreenLoc = { x: number; y: number, z?: number };


type BoundingClientRect = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export function checkPointContainedByDiv(point: ScreenLoc, divRect: BoundingClientRect | null = null): boolean {
  if (divRect) {
    return (
      point.x >= divRect.left &&
      point.x <= divRect.right &&
      point.y >= divRect.top &&
      point.y <= divRect.bottom
    );
  }
  return point.x >= 0 && point.x <= window.innerWidth && point.y >= 0 && point.y <= window.innerHeight;
}

export function checkElementContainedByDiv(el: HTMLElement, div: HTMLElement, centerOnly = true, fullyContained = false): boolean {
  const rect = el.getBoundingClientRect();
  const divRect = div.getBoundingClientRect();
  if (centerOnly) {
    const elCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    return (
      elCenter.x >= divRect.left &&
      elCenter.x <= divRect.right &&
      elCenter.y >= divRect.top &&
      elCenter.y <= divRect.bottom
    );
  } else {
    if (fullyContained) {
      return (
        rect.left >= divRect.left &&
        rect.right <= divRect.right &&
        rect.top >= divRect.top &&
        rect.bottom <= divRect.bottom
      );
    } else {
      return (
        rect.left <= divRect.right &&
        rect.right >= divRect.left &&
        rect.top <= divRect.bottom &&
        rect.bottom >= divRect.top
      );
    }
  }
}

  