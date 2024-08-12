<template>
  
  <div id="tour-layer">
    <div id="marker-layer"></div>
    <button class="tour-layer-button button1" @click="updateMarkers">Update Markers</button>
    <button class="tour-layer-button button2" @click="loadStarData">Load Stars</button>
        
  </div>
  
</template>

<style>

#tour-layer {
  z-index: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  contain: strict;
}

#marker-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.marker {
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: transparent;
  border-radius: 50%;
  border: 2px solid red;
  z-index: 1;
  transform: translate(-50%, -50%);
}

.star_marker {
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: rgb(255, 0, 251);
  border: none;
  border-radius: 50%;
  z-index: 1;
  pointer-events: none;
  /* outline: 1px solid white; */
}

.star_marker:hover {
  background-color: red;
}

.star_marker::before {
  /* label with ra dec */
  /* content: attr(data-ra) " " attr(data-dec); */
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  font-size: 10px;
}

.tour-layer-button {
  position: absolute;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  color: black;
  pointer-events: auto;
}

.button1 {
  top: 50%;
  left: 75%;
}

.button2 {
  top: 55%;
  left: 75%;
}

</style>


<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, watch } from 'vue';
import { engineStore } from "@wwtelescope/engine-pinia";
type WWTEngineStore = ReturnType<typeof engineStore>;
  
export interface Equatorial { 
  ra: number; 
  dec: number, 
}

export interface Star extends Equatorial {
  bv?: number, 
  color?: string, 
  logT?: number,
  mag?: number,
}

type Screen = { x: number; y: number };

import { getStarColor, magToRadius } from './star_colors';

// create Marker type that extends HTMLElement with the dataset property
interface Marker extends HTMLDivElement {
  dataset: {
    ra: string;
    dec: string;
    mag: string;
    bv: string;
    color: string;
    logT: string;
  };
}
  
// get engineStore from props
const props = defineProps<{
  store: WWTEngineStore;
}>();

const store = props.store;
const _D2R = Math.PI / 180;
// const H2R = Math.PI / 12;

// create list of marker divs
const markers = ref<Marker[]>([]);


const blazeStarLocation: Equatorial = {
  ra: (15 + 59 / 60 + 30.1622 / 3600) * 15,
  dec: (25 + 55 / 60 + 12.613 / 3600),
};

// get screen center pixel coords from html
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getScreenCenterPixel() {
  const screenCenter = document.body.getBoundingClientRect();
  return {
    x: screenCenter?.left + screenCenter?.width / 2,
    y: screenCenter?.top + screenCenter?.height / 2,
  };
}

function getMarkerLayer() {
  return document.getElementById("marker-layer");
}

function createMarker(loc: Equatorial | Star, class_name='') {
  const screen = worldToScreen(loc);
  const marker = document.createElement("div");
  marker.className = "marker";
  // append a class
  if (class_name) {
    marker.classList.add(class_name);
  }
  marker.style.left = `${screen.x}px`;
  marker.style.top = `${screen.y}px`;
  // add equatorial coordinates to marker
  marker.dataset.ra = loc.ra.toString();
  marker.dataset.dec = loc.dec.toString();
  // add bv to marker
  if ('bv' in loc) {
    marker.dataset.bv = `${loc.bv}`;
  }
  if ('color' in loc) {
    marker.dataset.color = loc.color;
    // set backgroundColor to loc.color
    if (loc.color) {
      marker.style.backgroundColor = loc.color;
    }
  }
  if ('mag' in loc) {
    marker.dataset.mag = `${loc.mag}`;
    if (loc.mag) {
      const mag = parseFloat(`${loc.mag}`);
      const radius = magToRadius(mag);
      marker.style.width = `${radius}px`;
      marker.style.height = `${radius}px`;
    }
  }
  
  
  return marker as Marker;
}

function isMarkerOnScreen(marker: Marker) {
  const screen = worldToScreen({
    ra: parseFloat(marker.dataset.ra),
    dec: parseFloat(marker.dataset.dec),
  });
  return screen.x >= 0 && screen.x <= window.innerWidth && screen.y >= 0 && screen.y <= window.innerHeight;
}

function addMarkerTo(el: HTMLElement, marker: Marker) {
  el.appendChild(marker);
}

function createMarkerLayer() {
  const markerLayer = document.createElement("div");
  markerLayer.id = "marker-layer";
  return markerLayer;
}

function addMarkersTo(markers: Marker[], el: HTMLElement) {
  markers.forEach((marker) => {
    addMarkerTo(el, marker);
  });
}

function removeMarker(marker: Marker) {
  marker.remove();
}

function updateMarker(marker: Marker) {
  const ra = parseFloat(marker.dataset.ra);
  const dec = parseFloat(marker.dataset.dec);
  const screen = worldToScreen({ ra, dec });
  marker.style.left = `${screen.x}px`;
  marker.style.top = `${screen.y}px`;
}

function updateMarkers() {

  markers.value.forEach((marker) => {
    // eslint-disable-next-line no-constant-condition
    if (!isMarkerOnScreen(marker)) {
      marker.style.display = "none";
      // removeMarker(marker);
    } else {
      marker.style.display = "block";
      updateMarker(marker);
    }
  });
  
}

// functin to convert world coordinates to screen coordinates
const worldToScreen = (world: Equatorial) => {
  // convert world coordinates to coordinates in radians
  return  store.findScreenPointForRADec(world);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const screenToWorld = (screen: Screen) => {
  return store.findRADecForScreenPoint(screen);
};


store.waitForReady().then(() => {
  const tcrbMarker = createMarker(blazeStarLocation);
  markers.value.push(tcrbMarker);
  const markerLayer = getMarkerLayer();
  if (markerLayer) {
    addMarkerTo(markerLayer, tcrbMarker);
  }
});

// resize observer to update markers on window resize
const resizeObserver = new ResizeObserver(() => {
  updateMarkers();
});
resizeObserver.observe(document.body);

watch(store, () => {
  updateMarkers();
});

const starJson = "https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/stars.6.json";
const starDataLoaded = ref(false);

function loadStarData() {
  fetch(starJson)
    .then((response) => response.json())
    .then((data) => {
      return data['features'];
    })
    .then((features) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      features.forEach((feature: any) => {
        if (feature.properties.mag > 4) {
          return;
        }
        const data = {
          ra: feature.geometry.coordinates[0],
          dec: feature.geometry.coordinates[1],
          bv: feature.properties.bv,
          color: getStarColor(parseFloat(feature.properties.bv)),
          mag: feature.properties.mag,
        } as Star;
        const star = createMarker(data, 'star_marker');
        markers.value.push(star);
      });
      starDataLoaded.value = true;
    })
    .then(() => {
      const makerLayer = getMarkerLayer();
      if (makerLayer) {
        addMarkersTo(markers.value, makerLayer);
      }
      updateMarkers();
    });
}


</script>
