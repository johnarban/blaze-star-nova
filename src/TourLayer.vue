<template>
  
  <div id="tour-layer" ref="parent">
    <div id="marker-container"></div>
    <div id="marker-frame"></div>
    <button class="tour-layer-button button2" @click="loadStarData">Load Stars</button>
  </div>
  
</template>



<script setup lang="ts">
import { ref, watch } from 'vue';
import { engineStore } from "@wwtelescope/engine-pinia";
import { getStarColor, magToRadius } from './star_colors';
import { useTrackedElements, TrackedHTMLElement } from './useTrackedElements';

type Equatorial = { 
  ra: number; 
  dec: number, 
};

type Star = Equatorial & {
  bv?: number, 
  color?: string, 
  logT?: number,
  mag?: number,
};

const store = engineStore();
const ute = useTrackedElements("marker-frame");
const markers = ute.trackedElements;


// template ref to the parent element
// this gets set to the element with ref="parent" in the template
const parent = ref<HTMLElement | null>(null);

const starJson = "https://raw.githubusercontent.com/ofrohn/d3-celestial/master/data/stars.6.json";
const starDataLoaded = ref(false);

const blazeStarLocation: Equatorial = {
  ra: (15 + 59 / 60 + 30.1622 / 3600) * 15,
  dec: (25 + 55 / 60 + 12.613 / 3600),
};



function getMarkerLayer() {
  return document.getElementById("marker-container");
}


function createCusomMarker(loc: Equatorial | Star, class_name='') {
  const marker = ute.createTrackedElement(loc);
  ute.addClassToElement(marker, class_name);
  
  // add bv to marker
  if ('bv' in loc && loc.bv) {
    marker.trackedData.bv = loc.bv;
  }
  
  // add color to marker
  if ('color' in loc && loc.color) {
    marker.trackedData.color = loc.color;
    marker.style.backgroundColor = loc.color;
  }
  
  // add mag to marker and set size based on mag
  if ('mag' in loc && loc.mag) {
    marker.trackedData.mag = loc.mag;
    const radius = magToRadius(loc.mag) ?? 15;
    marker.style.width = `${radius}px`;
    marker.style.height = `${radius}px`;
  }
  
  marker.style.display = ute.isMarkerVisible(marker)[1] ? 'block' : 'none';
  return marker;
}

function addMarkerToLayer(marker: TrackedHTMLElement , layer: HTMLElement | null = null) {
  if (layer) {
    layer.append(marker);
    return true;
  }
  return false;
}

// resize observer to update markers on window resize
const resizeObserver = new ResizeObserver(() => {
  ute.updateElements();
});
resizeObserver.observe(document.body);


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function processStarFeature(feature: any) {
  if (feature.properties.mag > 6) {
    return;
  }
  const data = {
    ra: feature.geometry.coordinates[0],
    dec: feature.geometry.coordinates[1],
    bv: feature.properties.bv,
    color: getStarColor(parseFloat(feature.properties.bv)),
    mag: feature.properties.mag,
  } as Star;
  return data;
}

function loadStarData() {
  const starMarkers: HTMLElement[] = [];
  fetch(starJson)
    .then((response) => response.json())
    .then((data) => {
      return data['features'];
    })
    .then((features) => {
      
      features.forEach((feature) => {
        const data = processStarFeature(feature);
        if (data) {
          const star = createCusomMarker(data, 'star_marker');
          starMarkers.push(star);
          
        }
      });
      starDataLoaded.value = true;
    })
    .then(() => {
      const makerLayer = getMarkerLayer();
      if (makerLayer) {
        starMarkers.forEach((star) => {
          makerLayer.append(star);
        });
      }
    });
}

store.waitForReady().then(() => {
  const marker = createCusomMarker(blazeStarLocation, 'tcrb_marker');
  addMarkerToLayer(marker, getMarkerLayer());
});

watch(store, () => {
  markers.value.forEach((marker) => {
    addMarkerToLayer(marker);
  });
  
});

</script>



<style>

#tour-layer {
  z-index: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  contain: strict;
}

#marker-container {
  position: relative;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

#marker-frame {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  /* outline: 1px solid magenta; */
}

.tracked-element {
  position: absolute;
  z-index: 1;
  transform: translate(-50%, -50%);
  
}

.tcrb_marker {
  border: 2px solid red;
  border-radius: 50%;
  width: 50px;
  height: 50px;
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
  /* background-color: red; */
  /* outline: 5px solid red; */
  scale: 1.5;
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
  z-index: 2;
}

.button1 {
  top: 50%;
  left: 75%;
}

.button2 {
  top: 55%;
  left: 75%;
}

progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
}

</style>