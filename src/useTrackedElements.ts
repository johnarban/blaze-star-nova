import { ref, watch, onUnmounted, onMounted } from 'vue';
import { engineStore } from '@wwtelescope/engine-pinia';
import { use3DTransform } from './use3DTransform';
import { checkPointContainedByDiv } from './check_dom_sizes';

const { findScreenPointForRADec } = use3DTransform();

export type LocationDegrees = {
  ra: number;
  dec: number;
};

export type ScreenPosition = {
  x: number;
  y: number;
  z: number;
};

export type TrackedElementData = LocationDegrees & Record<string, string | number>;


export interface TrackedHTMLElement extends HTMLElement {
  trackedData: TrackedElementData;
}

// create divs that move with the engine
export function useTrackedElements(layer: string) {
  
  // WWT setup
  const store = engineStore();
  const frameDiv = ref(null as HTMLElement | null);
  const frameDivRect = ref(null as DOMRect | null);
  const resizeObserver = ref(null as ResizeObserver | null);
  const wwtDiv = ref(null as HTMLElement | null);
  
  watch(frameDiv, (newDiv) => {
    if (newDiv) {
      frameDivRect.value = newDiv.getBoundingClientRect();
    }
  });
  
  onMounted(() => {
    const frame = document.getElementById(layer);
    if (frame) {
      frameDiv.value = frame;
      resizeObserver.value = new ResizeObserver(() => {
        if (!frameDiv.value) return;
        frameDivRect.value = frameDiv.value.getBoundingClientRect();
      });
      resizeObserver.value.observe(frameDiv.value);
    }
  });
  
  store.waitForReady().then(() => {
    
    if (frameDiv.value === null) {
      const frame = document.getElementById(layer);
      // @ts-expect-error - hackery way to get the canvas parent element
      wwtDiv.value = store.$wwt.inst.ctl.canvas.parentElement as HTMLElement;
      frameDiv.value = frame ?? wwtDiv.value;
      
      resizeObserver.value = new ResizeObserver(() => {
        if (!frameDiv.value) return;
        frameDivRect.value = frameDiv.value.getBoundingClientRect();
      });
      resizeObserver.value.observe(frameDiv.value);
    }
    
  });
  
  
  // Create 
  const trackedElements = ref<TrackedHTMLElement[]>([]);
  
  const updateOffScreenElements = ref(false);
  
  
  /**
   * Create a tracked element out of the given element  pt: RA/Dec
   * @returns TrackedHTMLElement
   */
  function placeElement(el: HTMLElement, pt: LocationDegrees): TrackedHTMLElement {
    
    const { x, y } = findScreenPointForRADec(pt);
    
    el.style.position = 'absolute';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    
    el.classList.add('tracked-element');
    (el as TrackedHTMLElement).trackedData = pt as TrackedElementData;
    
    trackedElements.value.push(el as TrackedHTMLElement);
    
    return el as TrackedHTMLElement;
  }
  
  function createElement(pt: {x: number, y: number}, tag="div"): HTMLElement {
    const marker = document.createElement(tag) as HTMLElement;
    marker.style.position = 'absolute';
    marker.style.left = `${pt.x}px`;
    marker.style.top = `${pt.y}px`;
    return marker;
  }
  
  
  
  /** Places a div at the given RA/Dec (degrees/degrees) location */
  function createTrackedElement(pt: TrackedElementData, tag='div', name: string = ''): TrackedHTMLElement {
    
    // get the screen position
    const { x, y } = findScreenPointForRADec(pt);
    
    const element = createElement({x, y}, tag) as TrackedHTMLElement;
    element.className = "tracked-element";
    
    // if it has a name, add an identifying class
    if (name) {
      element.classList.add(`tracked-element__${name}`);
    }
    
    element.trackedData = pt;
    
    trackedElements.value.push(element);
    return element as TrackedHTMLElement;
  }
  
  
  
  
  // add a class to an element
  function addClassToElement(element: HTMLElement, class_name: string) {
    element.classList.add(class_name);
  }
  
  
  const addElement = (el: TrackedHTMLElement) => {
    trackedElements.value.push(el);
  };
  
  const addElements = (el: TrackedHTMLElement[]) => {
    el.forEach((el) => {
      addElement(el);
    });
  };
  
  
  // update the screen position of the element
  function updateElementScreenPosition(el: TrackedHTMLElement, screenPos: ScreenPosition) {
    el.style.left = `${screenPos.x}px`;
    el.style.top = `${screenPos.y}px`;
  }
  
  // check if a marker is going to be visible on the WWT canvas
  function isMarkerVisible(el: TrackedHTMLElement): [ScreenPosition, boolean] {
    const screen = findScreenPointForRADec(el.trackedData);
    if (screen.z === 0) {
      return [screen, false];
    }
    return [screen, checkPointContainedByDiv(screen, frameDivRect.value)];
  }
  
  
  // updates all the elements
  function updateElements() {
    trackedElements.value.forEach((el) => {
      const [screenPos, onscreen] = isMarkerVisible(el);
      
      if (onscreen || updateOffScreenElements.value) {
        updateElementScreenPosition(el, screenPos);
      } 
      el.style.display = onscreen ? 'block' : 'none';
      
    });
  }
  
  /** Remove a tracked element from trackedElements list */
  function removeTrackedElement(el: TrackedHTMLElement) {
    const index = trackedElements.value.indexOf(el);
    if (index > -1) {
      trackedElements.value.splice(index, 1);
    }
    el.remove();
  }
  
  
  watch(store, () => {
    updateElements();
  });
  
  watch(updateOffScreenElements, () => {
    updateElements();
  });
  
  onUnmounted(() => {
    resizeObserver.value?.disconnect();
    trackedElements.value.forEach((el) => el.remove());
  });

  
  return { 
    trackedElements, 
    createTrackedElement,
    addClassToElement, 
    removeTrackedElement,
    updateElements,
    addElement,
    addElements,
    updateOffScreenElements,
    isMarkerVisible,
    placeElement
  };
    
}