<template>
    <div class="td__container">
      <div class="td__date" v-if="props.showDate && !props.shortTimeDate">
        <span class="td__date_date">
          {{ props.date.toLocaleString('default', { month: 'long' }) }} {{ pad(props.date.getDate()) }}, {{ props.date.getFullYear() }}
        </span>
      </div>
      <div class="td__time" v-if="!props.shortTimeDate">
        <span class="td__time_time">{{ pad(hours) }}:{{ pad(props.date.getMinutes()) }}:{{ pad(props.date.getSeconds()) }} {{ props.ampm ? ampm : '' }}</span>
      </div>
      <div class="td__timezone" v-if="props.showTimezone && !props.shortTimeDate">
        <span class="td__timezone_tz">{{ props.timezone }}</span>
      </div>
      <div class="td__time" v-if="props.shortTimeDate"> 
        <span class="td__time_time">{{ shortTimeDateString }}</span>
      </div>
      
   </div>  
</template>



<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps({
  date: { type: Date, required: true },
  ampm: { type: Boolean, default: false },
  showDate: { type: Boolean, default: true, required: false },
  showTimezone: { type: Boolean, default: true, required: false },
  shortTimeDate: { type: Boolean, default: false, required: false },
  timezone: { 
    type: String, 
    default: Intl.DateTimeFormat().resolvedOptions().timeZone, 
    required: false 
  }
}
);

function pad(number: number, length: number = 2): string {
  return String(number).padStart(length, '0');
}


const hours = computed(() => {
  if (props.ampm) {
    const hour = props.date.getHours() % 12;
    return hour === 0 ? 12 : hour;
  } else {
    return props.date.getHours();
  }
});


const ampm = computed(() => {
  return props.date.getHours() >= 12 ? 'PM' : 'AM';
});

const shortTimeDateString = computed(() => {
  // return date formatted as Oct 3 9:00 AM
  const month = props.date.toLocaleString('default', { month: 'short' });
  const day = props.date.getDate();
  const hour = props.date.getHours() % 12;
  const minute = pad(props.date.getMinutes());
  const ampm = props.date.getHours() >= 12 ? 'PM' : 'AM';
  const tz =  props.timezone;
  return `${month} ${day} ${hour}:${minute} ${ampm}` + (props.showTimezone ? ` ${tz}` : '');
});


</script>

<style>

.td__container {
  margin: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: currentColor;
}

.td__container > div > span {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}

.td__time {
  width: max-content;
}

.td__time_time {
  font-size: 1em;
  color: inherit;
  text-align: center;
  text-wrap: nowrap;
  width: fit-content;
}

.td__date {
  width: max-content;
}

.td__date_date {
  font-size: 0.75em;
  color: inherit;
  text-align: center;
  text-wrap: nowrap;
  width: fit-content;
}

.td__timezone {
  width: max-content;
}

.td__timezone_tz {
  font-size: 0.75em;
  color: inherit;
  text-align: center;
  text-wrap: nowrap;
  width: fit-content;
}

</style>