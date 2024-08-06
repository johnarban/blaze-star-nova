// geolocation.ts

// Vue composable for interacting with the geolocation API
import { ref, onMounted, onUnmounted, computed } from "vue";

type Position = {
  latitude: number | null;
  longitude: number | null;
};

export function useGeolocation(requestOnMount = true) {
  const isSupported = "geolocation" in navigator;
  const isLoading = ref(false);

  // PermissionStatus states
  // https://developer.mozilla.org/en-US/docs/Web/API/PermissionStatus/state
  const isPermissionGranted = ref(false);
  const isPermissionDenied = ref(false);
  const isPermissionPrompt = ref(false);
  const checkingPermissions = ref(false);
  const permissionsRequested = ref(false);

  const error = ref<Error | GeolocationPositionError | null>(null);

  const geolocationSuccess = ref(false);
  const position = ref<Position>({
    latitude: null,
    longitude: null,
  });
  
  const hasError = computed(() => error.value !== null);

  const handlePermission = (status: PermissionStatus) => {
    isPermissionGranted.value = status.state === "granted";
    isPermissionDenied.value = status.state === "denied";
    isPermissionPrompt.value = status.state === "prompt";
  };

  const checkPermission = async () => {
    checkingPermissions.value = true;
    error.value = null;

    try {
      const status = await navigator.permissions.query({ name: "geolocation" });
      handlePermission(status);
      status.onchange = () => handlePermission(status);
    } catch (err) {
      console.error("Error getting permission", err);
      error.value = err as Error;
    } finally {
      permissionsRequested.value = true;
      checkingPermissions.value = false;
    }
  };

  const handleSuccess = (pos: GeolocationPosition) => {
    isLoading.value = false;
    geolocationSuccess.value = true;
    position.value = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
  };

  const handleError = (err: GeolocationPositionError) => {
    isLoading.value = false;
    if (err.code === err.PERMISSION_DENIED) {
      isPermissionDenied.value = true;
      const url = "https://www.lifewire.com/turn-on-mobile-location-services-4156232";
      error.value = {
        code: 1,
        message: `Location access was denied. Try enabling location services for your browser in system settings. (This feature might not work on Safari on some iPhones). <a href="${url}" target="_blank" rel="noopener noreferrer">Help</a>`,
      } as GeolocationPositionError;
    } else if (err.code === err.POSITION_UNAVAILABLE) {
      error.value = {
        code: 2,
        message: "Location information is unavailable.",
      } as GeolocationPositionError;
    } else if (err.code === err.TIMEOUT) {
      error.value = {
        code: 3,
        message: "The request to get user location timed out.",
      } as GeolocationPositionError;
    } else {
      error.value = err;
    }
  };

  const getCurrentLocation = async () => {
    if (!isSupported) {
      return;
    }
    
    if (!permissionsRequested.value) {
      checkPermission();
    }

    isLoading.value = true;
    error.value = null;

    const options = {
      enableHighAccuracy: true,
      timeout: 60 * 1000, // 1 minute
      maximumAge: 5 * 60 * 1000, // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      options
    );
  };

  let watchId: number | null = null;

  const watchLocation = () => {
    if (!isSupported) {
      return;
    }

    isLoading.value = true;
    error.value = null;

    const options = {
      enableHighAccuracy: true,
      timeout: 60 * 1000, // 1 minute
      maximumAge: 5 * 60 * 1000, // 5 minutes
    };

    watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );
  };

  const clearWatch = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  };

  onMounted(() => {
    if (requestOnMount) {
      checkPermission();
    }
  });

  onUnmounted(() => {
    clearWatch();
  });

  return {
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
    checkPermission, // function to request geolocation permission
    getCurrentLocation, // function to get the current location
    watchLocation, // function to watch the location
    clearWatch, // function to clear the location watch
  };
}
