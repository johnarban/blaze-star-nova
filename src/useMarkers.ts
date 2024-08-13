import { ref } from 'vue';
import { Marker } from './wwt_dom_annotations';


export interface Vector3d {
  x: number;
  y: number;
  z: number;
}

export function useMarkers() {
  const markers = ref<Marker[]>([]);

  function createMarker(screenX: number, screenY: number, class_name = ''): Marker {
    const marker = document.createElement("div") as Marker;
    marker.className = "marker";

    // append a class
    if (class_name) {
      marker.classList.add(class_name);
    }
    marker.style.left = `${screenX}px`;
    marker.style.top = `${screenY}px`;

    return marker;
  }


  const addMarker = (marker: Marker) => {
    markers.value.push(marker);
  };
  
  const addMarkers= (markers: Marker[]) => {
    markers.forEach((marker) => {
      addMarker(marker);
    });
  };
  
  
  const addMarkerTo = (marker: Marker, layer: HTMLElement) => {
    layer.appendChild(marker);
  };
  
  const addMarkersTo = (markers: Marker[], layer: HTMLElement) => {
    markers.forEach((marker) => {
      addMarkerTo(marker, layer);
    });
  };
  
  
  
  return { markers, createMarker, addMarker, addMarkers, addMarkerTo, addMarkersTo };
}
