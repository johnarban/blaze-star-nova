import { Ref, computed} from 'vue';
import { getTimezoneOffset, formatInTimeZone } from "date-fns-tz";
import tzlookup from "tz-lookup";
import { LocationDeg } from './types';



export function useTimezone(selectedLocation: Ref<LocationDeg>) {
  // selectedDate keeps track of the time the user has selected
  
  const selectedTimezone = computed(() => tzlookup(selectedLocation.value.latitudeDeg, selectedLocation.value.longitudeDeg));

  // what we add to utc time to get the localized time
  const selectedTimezoneOffset = computed(() => getTimezoneOffset(selectedTimezone.value));
  const shortTimezone = computed(() => formatInTimeZone(new Date(), selectedTimezone.value, "zzz"));

  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // this is added to (new Date()).getHours() to get UTC hours
  const browserTimezoneOffset = new Date().getTimezoneOffset() * 60 * 1000; // in milliseconds
  
  
  console.log('Browser timezone:', browserTimezone);
  console.log('Browser timezone offset:', browserTimezoneOffset);
  console.log('Selected timezone:', selectedTimezone.value);
  console.log('Selected timezone offset:', selectedTimezoneOffset.value);
  
  return {
    selectedTimezone,
    shortTimezone,
    selectedTimezoneOffset,
    browserTimezone,
    browserTimezoneOffset,
  };
}