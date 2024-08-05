<template>
  <v-overlay :model-value="showSplashScreen" absolute opacity="0.6" :style="props.cssVars" id="splash-overlay">
      <div id="splash-screen" v-click-outside="closeSplashScreen" :style="props.cssVars">
        <div id="close-splash-button" @click="closeSplashScreen">&times;
        </div>
        <div id="splash-screen-text">
          <p>Splash Screen Content</p>
        </div>
        <div id="splash-screen-acknowledgements" class="small">
          This Data Story is brought to you by <a href="https://www.cosmicds.cfa.harvard.edu/" target="_blank"
            rel="noopener noreferrer">Cosmic Data Stories</a> and <a href="https://www.worldwidetelescope.org/home/"
            target="_blank" rel="noopener noreferrer">WorldWide Telescope</a>.

          <div id="splash-screen-logos">
            <credit-logos logo-size="5vmin" />
          </div>
        </div>
      </div>
    </v-overlay>
</template>


<script setup lang="ts">
import { defineProps, defineModel, defineEmits, withDefaults } from 'vue';
console.log('SplashScreen.vue');

export interface Props {
  cssVars?: object;
}

const props = withDefaults(defineProps<Props>(),{
  cssVars: () => ({})
});

const emits = defineEmits(['close']);

const showSplashScreen = defineModel({default: true});


function closeSplashScreen() {
  showSplashScreen.value = false;
  emits('close');
}


</script>


<style lang="less">


#splash-overlay {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

#splash-screen {
  color: #FFFFFF;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center;
  justify-content: space-around;

  font-family: 'Highway Gothic Narrow', 'Roboto', sans-serif;
  font-size: min(8vw, 7vh);

  border-radius: 10%;
  border: min(1.2vw, 0.9vh) solid var(--accent-color);
  overflow: auto;
  padding-top: 4rem;
  padding-bottom: 1rem;

  @media (max-width: 699px) {
    max-height: 80vh;
    max-width: 90vw;
  }

  @media (min-width: 700px) {
    max-height: 85vh;
    max-width: min(70vw, 800px);
  }

  div {
    margin-inline: auto;
    text-align: center;
  }

  .small {
    font-size: var(--default-font-size);
    font-weight: bold;
  }

  #close-splash-button {
    position: absolute;
    top: 0.5rem;
    right: 1.75rem;
    text-align: end;
    color: var(--accent-color);
    font-size: min(8vw, 5vh);

    &:hover {
      cursor: pointer;
    }
  }
}


</style>