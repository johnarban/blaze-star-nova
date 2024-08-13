<template>
  
  <div id="tour-layer" ref="parent">
    <div id="marker-layer"></div>
    <button class="tour-layer-button button1" @click="updateMarkers">Update Markers</button>
    <button class="tour-layer-button button2" @click="loadStarData">Load Stars</button>
  </div>
  
</template>



<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ref, watch, onMounted, computed } from 'vue';
import { engineStore } from "@wwtelescope/engine-pinia";
import { WWTControl} from "@wwtelescope/engine";
type WWTEngineStore = ReturnType<typeof engineStore>;
import { 
  Equatorial, 
  Star, 
  ScreenLoc, 
  Marker, 
  checkPointContainedByDiv 
} from './wwt_dom_annotations';
  
import { getStarColor, magToRadius } from './star_colors';
import { use3DTransform } from './use3DTransform';
import { useMarkers } from './useMarkers';

const { findScreenPointForRADec } = use3DTransform();

// get engineStore from props
const props = defineProps<{
  store: WWTEngineStore;
}>();
const store = props.store;

// template ref to the parent element
// this gets set to the element with ref="parent" in the template
const parent = ref<HTMLElement | null>(null);
const parentSize = computed(() => {
  return {
    width: parent.value?.clientWidth || 0,
    height: parent.value?.clientHeight || 0,
  };
});

function getMarkerLayer() {
  return document.getElementById("marker-layer");
}

const { markers, createMarker, addMarker, addMarkers, addMarkerTo, addMarkersTo } = useMarkers();


const blazeStarLocation: Equatorial = {
  ra: (15 + 59 / 60 + 30.1622 / 3600) * 15,
  dec: (25 + 55 / 60 + 12.613 / 3600),
};



function createCusomMarker(loc: Equatorial | Star, class_name='') {
  const screen = worldToScreen(loc);
  const marker = createMarker(screen.x, screen.y, class_name);
  
  
  // add equatorial coordinates to marker
  marker.dataset.ra = loc.ra.toString();
  marker.dataset.dec = loc.dec.toString();
  
  // add bv to marker
  if ('bv' in loc) {
    marker.dataset.bv = `${loc.bv}`;
  }
  
  // add color to marker
  if ('color' in loc) {
    // set backgroundColor to loc.color
    if (loc.color) {
      marker.dataset.color = loc.color;
      marker.style.backgroundColor = loc.color;
    }
  }
  
  // add mag to marker and set size based on mag
  if ('mag' in loc) {
    marker.dataset.mag = `${loc.mag}`;
    const radius = magToRadius(loc.mag) ?? 15;
    marker.style.width = `${radius}px`;
    marker.style.height = `${radius}px`;
  }
  
  return marker as Marker;
}

// function to convert world coordinates to screen coordinates
const worldToScreen = (world: Equatorial): ScreenLoc => {
  const vec3 =  findScreenPointForRADec(world);
  return vec3;
};


function updateMarker(marker: Marker, screen: ScreenLoc | undefined = undefined) {
  const ra = parseFloat(marker.dataset.ra);
  const dec = parseFloat(marker.dataset.dec);
  const screenVal = screen ?? worldToScreen({ ra, dec });
  marker.style.left = `${screenVal.x}px`;
  marker.style.top = `${screenVal.y}px`;
}

function isMarkerOnScreen(marker: Marker): [boolean, ScreenLoc] {
  const screen = worldToScreen({
    ra: +marker.dataset.ra,
    dec: +marker.dataset.dec,
  });
  if (screen.z === 0) {
    return [false, screen];
  }
  return [checkPointContainedByDiv(screen), screen];
}

function updateMarkers() {
  markers.value.forEach((marker) => {
    const [check, screen] = isMarkerOnScreen(marker);
    if (!check) {
      marker.style.display = "none";
    } else {
      marker.style.display = "block";
      updateMarker(marker, screen);
    }
  });
}




store.waitForReady().then(() => {
  const tcrbMarker = createCusomMarker(blazeStarLocation, "tcrb_marker");
  addMarker(tcrbMarker);
  const markerLayer = getMarkerLayer();
  console.log(markers.value);
  if (markerLayer) {
    addMarkerTo(tcrbMarker, markerLayer);
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
  const starMarkers: Marker[] = [];
  fetch(starJson)
    .then((response) => response.json())
    .then((data) => {
      return data['features'];
    })
    .then((features) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      features.forEach((feature: any) => {
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
        const star = createCusomMarker(data, 'star_marker');
        starMarkers.push(star);
      });
      starDataLoaded.value = true;
    })
    .then(() => {
      const makerLayer = getMarkerLayer();
      addMarkers(starMarkers);
      if (makerLayer) {
        addMarkersTo(starMarkers, makerLayer);
      }
      updateMarkers();
    });
}


</script>



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
  pointer-events: auto;
  /* outline: 1px solid white; */
}

.star_marker:hover {
  background-color: red;
  outline: 5px solid red;
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

</style>