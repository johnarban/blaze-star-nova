<template>
  <v-overlay :model-value="showSplashScreen" absolute opacity="0.6" :style="props.cssVars" id="splash-overlay">
      <div id="splash-screen" v-click-outside="closeSplashScreen" :style="props.cssVars">
        <div id="close-splash-button" @click="closeSplashScreen">&times;
        </div>
        <div id="splash-screen-text">
          <p class="highlight">Blaze Star Nova</p>
          <p>Learn where in the sky to watch for a "new" star!</p>
        </div>
        <div id="splash-screen-acknowledgements" class="splash-screen-small">
          <span>This Data Story is brought to you by <a href="https://www.cosmicds.cfa.harvard.edu/" target="_blank"
            rel="noopener noreferrer">Cosmic Data Stories</a> and <a href="https://www.worldwidetelescope.org/home/"
            target="_blank" rel="noopener noreferrer">WorldWide Telescope</a>.</span>

          <div id="splash-screen-logos">
            <credit-logos logo-size="5vmin" />
          </div>
          <div id="image-credit">
            Image credit: NASA / Goddard Space Flight Center
          </div>
        </div>
      </div>
    </v-overlay>
</template>


<script setup lang="ts">
import { defineProps, defineModel, defineEmits, withDefaults } from 'vue';
console.log('SplashScreen.vue');

export interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cssVars?: any;
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
  color: black;
  background-color: #000000;
  background-image: url('https://www.nasa.gov/wp-content/uploads/2024/06/novacyg093500952-print.jpg');
  background-position: 80% bottom;

  display: flex;
  flex-direction: column;
  // flex-wrap: wrap;
  align-content: center;
  justify-content: space-around;

  font-family: 'Highway Gothic Narrow', 'Roboto', sans-serif;
  font-size: min(9vw, 6vh);

  border-radius: 30px;
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
    max-width: min(65vw, 800px);
  }

  div {
    margin-inline: 7%;
    text-align: center;
  }
  
  p.highlight {
    color: var(--accent-color);
    text-transform: uppercase;
    font-weight: bolder;
    text-shadow: 0 0 16px black;
    filter: drop-shadow(0 0 5px black);
    font-size: 1.2em;

    @media (max-width: 750px) {
      font-weight: bold;
    }
  }

  p:not(.highlight) {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 15px;
    margin: 1rem;
  }

  .splash-screen-small {
    font-size: var(--default-font-size);
    font-weight: bold;
    margin-top: 1rem;
  }
  
  #splash-screen-acknowledgements > span {
    background-color: rgba(0, 0, 0, 0.2);
    color: white;
  }

  #splash-screen-logos {
    margin-top: 1.5rem;
  }

  #close-splash-button {
    position: absolute;
    top: 0.5rem;
    right: 0;
    text-align: end;
    color: var(--accent-color);
    font-size: min(8vw, 5vh);

    &:hover {
      cursor: pointer;
    }
  }

  #image-credit {
    position: absolute;
    bottom: 0.5rem;
    left: -1rem;
    font-size: calc(0.7 * var(--default-font-size));
    font-weight: 400;
    color: #DDDDDD;
  }
}


</style>