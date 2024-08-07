// wwt_playback_control.ts

// Vue composable for controlling the playback and playrate of the WWT engine
import { ref, watch } from "vue";
import { engineStore } from "@wwtelescope/engine-pinia";
type WWTEngineStore = ReturnType<typeof engineStore>;
export function usePlaybackControl(store: WWTEngineStore, debug = false) {
  console.log("usePlaybackControl");
  const clockRate = ref(1);
  const timePlaying = ref(false);
  
  const play = () => { timePlaying.value = true; };
  
  const pause = () => { timePlaying.value = false; };

  const togglePlay = () => { timePlaying.value = !timePlaying.value; };
  
  
  function setSpeed(rate: number) {
    clockRate.value = rate;
  }
  

  store.waitForReady().then(() => {
    watch(clockRate, (newRate) => {
      console.log("playbackRate changed", newRate);
      store.setClockRate(newRate);
    });

    watch(timePlaying, (newIsPlaying) => {
      console.log("isPlaying changed", newIsPlaying);
      store.setClockSync(newIsPlaying);
    });
    store.setClockRate(clockRate.value);
    store.setClockSync(timePlaying.value);
  });
  
  // watch everything and log out what changes
  if (debug) {
    watch(clockRate, (newRate) => {
      console.log("playbackRate changed", newRate);
    });
    watch(timePlaying, (newIsPlaying) => {
      console.log("isPlaying changed", newIsPlaying);
    });
  }

  
  

    
    


  return {
    play, 
    pause,
    togglePlay,
    setSpeed,
    timePlaying,
    clockRate
  };
  
}
    