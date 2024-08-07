<!-- Design Inspired by Date/Time Picker at Stellarium Web https://stellarium-web.org/ -->
<template>
  <div class="dtp__container">
    <div class="dtp__grid-container">
      <!-- <div class="dtp__rollers up-rollers"> -->
      <button id="dtp_year-up" class="dtp_grid-item" @click="increment('year')">
        <v-icon>mdi-menu-up</v-icon>
      </button>
      <span></span>
      <button id="dtp_month-up" class="dtp_grid-item" @click="increment('month')">
        <v-icon>mdi-menu-up</v-icon>
      </button>
      <span></span>
      <button id="dtp_day-up" class="dtp_grid-item" @click="increment('day')">
        <v-icon>mdi-menu-up</v-icon>
      </button>
      <slot name="top-middle"><span></span></slot>
      <button id="dtp_hour-up" class="dtp_grid-item" @click="increment('hour')">
        <v-icon>mdi-menu-up</v-icon>
      </button>
      <span></span>
      <button id="dtp_minute-up" class="dtp_grid-item" @click="increment('minute')">
        <v-icon>mdi-menu-up</v-icon>
      </button>
      <span></span>
      <button id="dtp_second-up" class="dtp_grid-item" @click="increment('second')">
        <v-icon>mdi-menu-up</v-icon>
      </button>
      <!-- </div> -->

      <!-- <span class="dtp_time-string"> -->
      <span id="dtp_year" class="dtp_grid-item dtp_time_part">{{ year }}</span>
      <span>-</span>
      <span id="dtp_month" class="dtp_grid-item dtp_time_part">{{ pad2(month) }}</span>
      <span>-</span>
      <span id="dtp_day" class="dtp_grid-item dtp_time_part">{{ pad2(day) }}</span> 
      <span class="dtp__middle-slot"><slot name="center-middle"></slot></span>
      <span id="dtp_hour" class="dtp_grid-item dtp_time_part">{{ pad2(hour) }}</span>
      <span>:</span>
      <span id="dtp_minute" class="dtp_grid-item dtp_time_part">{{ pad2(minute) }}</span>
      <span>:</span>
      <span id="dtp_second" class="dtp_grid-item dtp_time_part">{{ pad2(second) }}</span>
      <!-- </span> -->

      <button id="dtp_year-up" class="dtp_grid-item" @click="decrement('year')">
        <v-icon>mdi-menu-down</v-icon>
      </button>
      <span></span>
      <button id="dtp_month-up" class="dtp_grid-item" @click="decrement('month')">
        <v-icon>mdi-menu-down</v-icon>
      </button>
      <slot name="bottom-middle"><span></span></slot>
      <button id="dtp_day-up" class="dtp_grid-item" @click="decrement('day')">
        <v-icon>mdi-menu-down</v-icon>
      </button>
      <span></span>
      <button id="dtp_hour-up" class="dtp_grid-item" @click="decrement('hour')">
        <v-icon>mdi-menu-down</v-icon>
      </button>
      <span></span>
      <button id="dtp_minute-up" class="dtp_grid-item" @click="decrement('minute')">
        <v-icon>mdi-menu-down</v-icon>
      </button>
      <span></span>
      <button id="dtp_second-up" class="dtp_grid-item" @click="decrement('second')">
        <v-icon>mdi-menu-down</v-icon>
      </button>
    </div>
    <div class="dtp__bottom-content">
      <slot></slot>
    </div>
    <div v-if="props.debug" class="dtp_debug">
      <span>Local: {{ year }}-{{ pad2(month) }}-{{ pad2(day) }} {{ pad2(hour) }}:{{ pad2(minute) }}:{{ pad2(second) }}</span>
      <span>UTC: {{ utcDate(date) }} </span>
    </div>

  </div>

</template>


<script setup lang="ts">
import { ref, watch, computed, withDefaults } from 'vue';


export interface Props {
  debug?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  debug: false,
});



const date = defineModel({default: new Date('2027-01-01 12:00:00 UTC')});

const year = ref(date.value.getFullYear());
const month = ref(date.value.getMonth()+1);
const day = ref(date.value.getDate());
const hour = ref(date.value.getHours());
const minute = ref(date.value.getMinutes());
const second = ref(date.value.getSeconds());

const values = {
  year: year,
  month: month,
  day: day,
  hour: hour,
  minute: minute,
  second: second,
};

type Unit = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

const limits = computed(() => ({
  year: { min: 1, max: Infinity },
  month: { min: 1, max: 12 },
  day: { min: 1, max: () => _daysInMonth(month.value, year.value) },
  hour: { min: 0, max: 23 },
  minute: { min: 0, max: 59 },
  second: { min: 0, max: 59 },
}));

const units: Unit[] = ['second', 'minute', 'hour', 'day', 'month', 'year'];

function changeValue(unit: Unit, increment: boolean) {
  // recursive logic help courtesy of chatgpt :)
  const limit = typeof limits.value[unit].max === 'function' ? limits.value[unit].max() : limits.value[unit].max;
  const min = limits.value[unit].min;

  if (increment) {
    if (values[unit].value < limit) {
      values[unit].value++;
    } else {
      values[unit].value = min;
      const nextUnit = units[units.indexOf(unit) + 1];
      if (nextUnit) changeValue(nextUnit, increment);
    }
  } else {
    if (values[unit].value > min) {
      values[unit].value--;
    } else {
      const prevUnit = units[units.indexOf(unit) + 1];
      if (prevUnit) {
        changeValue(prevUnit, increment);
        values[unit].value = typeof limits.value[unit].max === 'function' ? limits.value[unit].max() : limits.value[unit].max;
      }
    }
  }
}

function increment(value: Unit) {
  changeValue(value, true);
}

function decrement(value: Unit) {
  changeValue(value, false);
}

function _daysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}


function utcDate(date: Date) {
  // utc date string
  return date.toISOString(); 
}

function pad2(n: number) {
  return n.toString().padStart(2, '0');
}

// update the date v-model
watch([year, month, day, hour, minute, second], () => {
  date.value = new Date(year.value, month.value-1, day.value, hour.value, minute.value, second.value);
});

// watcher to fix leap years
watch([year, month, day, hour, minute, second], () => {
  if (month.value === 2 && day.value > _daysInMonth(month.value, year.value)) {
    day.value = _daysInMonth(month.value, year.value);
  }
});
// after we have mounted make the up and down buttons the same width
// keep this up to date with the model value
watch(date, () => {
  year.value = date.value.getFullYear();
  month.value = date.value.getMonth()+1;
  day.value = date.value.getDate();
  hour.value = date.value.getHours();
  minute.value = date.value.getMinutes();
  second.value = date.value.getSeconds();
});

</script>

<style lang="less">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@500&display=swap');

.dtp__container {
  padding-top: 10px;
  padding-bottom: 5px;
  padding-inline: 15px;
}

.dtp__grid-container {
  display: grid;
  grid-template-columns: repeat(11, 0fr);
  justify-items: center;
  justify-content: center;
  font-family: 'Noto Sans Mono', monospace;
}

.dtp__grid-container > * {
  margin: 0;
  padding: 0;
  width: 100%;
}

.dtp__middle-slot {
  width: 2em;
}

.dtp__bottom-content {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>