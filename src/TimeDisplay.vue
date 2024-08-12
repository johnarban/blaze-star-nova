<template>
    <div class="td__container">
      <div class="td__time">
        <span class="td__time_time">{{ pad(hours) }}:{{ pad(props.date.getMinutes()) }}:{{ pad(props.date.getSeconds()) }} {{ props.ampm ? ampm : '' }}</span>
      </div>
      <div class="td__date">
        <span class="td__date_date">{{ props.date.getFullYear() }}-{{ pad(props.date.getMonth() + 1) }}-{{ pad(props.date.getDate()) }}</span>
      </div>
      <div class="td__timezone" v-if="props.showTimezone">
        <span class="td__timezone_tz">{{ props.timezone }}</span>
      </div>
   </div>  
</template>



<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps({
  date: { type: Date, required: true },
  ampm: { type: Boolean, default: false },
  showTimezone: { type: Boolean, default: false, required: false },
  timezone: { 
    type: String, 
    default: Intl.DateTimeFormat().resolvedOptions().timeZone, 
    required: false 
  },
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