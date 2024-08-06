// wwt_playback_control.ts

// Vue composable for controlling the playback and playrate of the WWT engine
import { ref, watch } from "vue";
import { engineStore } from "@wwtelescope/engine-pinia";
type WWTEngineStore = ReturnType<typeof engineStore>;
export function usePlaybackControl(store: WWTEngineStore) {
  console.log("usePlaybackControl");
  const playbackRate = ref(1);
  const isPlaying = ref(false);
  
  const play = () => { isPlaying.value = true; };
  
  const pause = () => { isPlaying.value = false; };

  const togglePlay = () => { isPlaying.value = !isPlaying.value; };
  
  
  function setSpeed(rate: number) {
    playbackRate.value = rate;
  }
  

  store.waitForReady().then(() => {
    watch(playbackRate, (newRate) => {
      console.log("playbackRate changed", newRate);
      store.setClockRate(newRate);
    });

    watch(isPlaying, (newIsPlaying) => {
      console.log("isPlaying changed", newIsPlaying);
      store.setClockSync(newIsPlaying);
    });
    store.setClockRate(playbackRate.value);
    store.setClockSync(isPlaying.value);
  });

  
  

    
    


  return {
    play, 
    pause,
    togglePlay,
    setSpeed,
    isPlaying,
    playbackRate
  };
  
}
    