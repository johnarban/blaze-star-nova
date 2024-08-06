<template>
  <span :id="`geolocation-wrapper+${id}`" class="jl_geolocation">
    <VBtn 
      class="geolocation-button"
      :density="density"
      :size="size"
      variant="flat"
      :elevation="elevation"
      :loading="isLoading"
      :icon="icon"
      :color="hasError ? 'red' : color"
      @click="getCurrentLocation" 
    />
    
    <div v-if="debug" class="geolocation-debug">
      <div>
        <div>isSupported: {{ isSupported }}</div>
        <div>permissionsRequested: {{ permissionsRequested }}</div>
        <div>isPermissionGranted: {{ isPermissionGranted }}</div>
        <div>isPermissionDenied: {{ isPermissionDenied }}</div>
        <div>isPermissionPrompt: {{ isPermissionPrompt }}</div>
        <div>checkingPermissions: {{ checkingPermissions }}</div>
        <div>isLoading: {{ isLoading }}</div>
        <div>error: {{ error }}</div>
        <div>hasError: {{ hasError }}</div>
        <div>geolocationSuccess: {{ geolocationSuccess }}</div>
        <div>position: {{ position }}</div>
      </div>
    </div>

  </span>
  

</template>

<script setup lang="ts">
import { withDefaults, defineProps, computed } from 'vue';
import { VBtn } from 'vuetify/components/VBtn';
import { useGeolocation } from './geolocation';

type Density = null | 'default' | 'comfortable' | 'compact';

export interface GeolocationProps {
  color?: string;
  debug?: boolean;
  disabled?: boolean;
  size?: string;
  density?: Density;
  elevation?: string;
  showCoords?: boolean;
  showLoading?: boolean;
  id?: string | null;
  trueIcon?: string;
  falseIcon?: string;
  backgroundColor?: string;
  showPermissions?: boolean;
}

// Define props with default values using withDefaults
const props = withDefaults(defineProps<GeolocationProps>(), {
  color: 'white',
  debug: false,
  disabled: false,
  size: 'small',
  density: 'comfortable',
  elevation: "2",
  showCoords: false,
  showLoading: true,
  useTextButton: false,
  progressCircleSize: 12,
  id: '',
  trueIcon: 'mdi-crosshairs-gps',
  falseIcon: 'mdi-crosshairs',
  backgroundColor: 'black',
  showPermissions: false,
});



const { 
  isSupported, // If geolocation is supported in the browser
  isPermissionGranted, // If the user has granted geolocation permission
  isPermissionDenied, // If the user has denied geolocation permission
  isPermissionPrompt, // If the user has not yet been prompted for geolocation permission
  permissionsRequested, // flag that we have requested permissions
  checkingPermissions, // flag that we are checking the permissions
  isLoading, // flag that we are getting the location
  error, // error object if there was an error
  hasError, // flag that there was an error
  geolocationSuccess, // flag that we have successfully gotten the location
  position, // object with latitude and longitude
  getCurrentLocation, // function to get the current location
} = useGeolocation(true);

const icon = computed(() => geolocationSuccess.value ? props.trueIcon : props.falseIcon);

</script>


<style>
.jl_geolocation{
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: left;
}
.geolocation-debug {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  border: 1px solid red;
  margin: 5px;
  padding: 5px;
}

</style>