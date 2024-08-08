<template>
  
  <div id="tour-layer">
    <button class="tour-layer-button button1" @click="updateMarkers">Update Markers</button>
        
  </div>
  
</template>

<style>

#tour-layer {
  z-index: 1;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  /* border: 2px solid red; */
}

.marker {
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: transparent;
  border-radius: 50%;
  border: 2px solid red;
  z-index: 1000;
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

import { ref, watch } from 'vue';
import { engineStore } from "@wwtelescope/engine-pinia";
type WWTEngineStore = ReturnType<typeof engineStore>;
  
type Equatorial = { ra: number; dec: number };
type Screen = { x: number; y: number };

// create Marker type that extends HTMLElement with the dataset property
interface Marker extends HTMLDivElement {
  dataset: {
    ra: string;
    dec: string;
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

function addMarker(loc: Equatorial) {
  const screen = worldToScreen(loc);
  const marker = document.createElement("div");
  marker.className = "marker";
  marker.style.left = `${screen.x}px`;
  marker.style.top = `${screen.y}px`;
  // add equatorial coordinates to marker
  marker.dataset.ra = loc.ra.toString();
  marker.dataset.dec = loc.dec.toString();
  document.getElementById("tour-layer")?.appendChild(marker);
  markers.value.push(marker as Marker);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function removeMarker(marker: Marker) {
  marker.remove();
  markers.value = markers.value.filter((m) => m !== marker);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function hideMarkers() {
  markers.value.forEach((marker) => {
    marker.style.display = "none";
  });
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function showMarkers() {
  markers.value.forEach((marker) => {
    marker.style.display = "block";
  });
}

function updateMarkers() {
  console.log("updating markers");
  markers.value.forEach((marker) => {
    const ra = parseFloat(marker.dataset.ra);
    const dec = parseFloat(marker.dataset.dec);
    const screen = worldToScreen({ ra, dec });
    marker.style.left = `${screen.x}px`;
    marker.style.top = `${screen.y}px`;
  });
}

// functin to convert world coordinates to screen coordinates
const worldToScreen = (world: Equatorial) => {
  // convert world coordinates to coordinates in radians
  return store.findScreenPointForRADec(world);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const screenToWorld = (screen: Screen) => {
  return store.findRADecForScreenPoint(screen);
};



store.waitForReady().then(() => {
  addMarker(blazeStarLocation);
});

// resize observer to update markers on window resize
const resizeObserver = new ResizeObserver(() => {
  updateMarkers();
});
resizeObserver.observe(document.body);

watch(store, () => {
  updateMarkers();
});


</script>
