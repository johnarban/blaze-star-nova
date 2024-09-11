<!-- Design Inspired by Date/Time Picker at Stellarium Web https://stellarium-web.org/ -->
<template>
  <div class="dtp__container">
    <div class="dtp__row">
    <div class="dtp__grid-container">
      <!-- <div class="dtp__rollers up-rollers"> -->
      <button id="dtp__year-up" class="dtp__grid-item" @click="increment('year')">
        <span class="dtp__button-label">yr</span>
        <v-icon>mdi-menu-up</v-icon>
      </button>
      <span></span>
      <button id="dtp__month-up" class="dtp__grid-item" @click="increment('month')">
        <span class="dtp__button-label">mo</span>
        <v-icon>mdi-menu-up</v-icon>
      </button>
      <span></span>
      <button id="dtp__day-up" class="dtp__grid-item" @click="increment('day')">
        <span class="dtp__button-label">day</span>
        <v-icon>mdi-menu-up</v-icon>
      </button>
      <slot name="top-middle"><span></span></slot>
      <button id="dtp__hour-up" class="dtp__grid-item" @click="increment('hour')">
        <span class="dtp__button-label">hr</span>
        <v-icon>mdi-menu-up</v-icon>
      </button>
      <span></span>
      <button id="dtp__minute-up" class="dtp__grid-item" @click="increment('minute')">
        <span class="dtp__button-label">min</span>
        <v-icon>mdi-menu-up</v-icon>
      </button>
      <span></span>
      <button id="dtp__second-up" class="dtp__grid-item" @click="increment('second')">
        <span class="dtp__button-label">sec</span>
        <v-icon>mdi-menu-up</v-icon>
      </button>
      <!-- </div> -->

      <!-- <span class="dtp__time-string"> -->
      <!-- <span id="dtp__year" class="dtp__grid-item dtp__time_part">{{ year }}</span> -->
      <tap-to-input :editable="props.editableTime" id="dtp__year" class="dtp__grid-item dtp__time_part" :min="limits.year.min" :max="limits.year.max" v-model="year" />
      <span>-</span>
      <!-- <span id="dtp__month" class="dtp__grid-item dtp__time_part">{{ pad2(month) }}</span> -->
      <tap-to-input :editable="props.editableTime" id="dtp__month" class="dtp__grid-item dtp__time_part" :min="limits.month.min" :max="limits.month.max" pad2 v-model="month" />
      <span>-</span>
      <!-- <span id="dtp__day" class="dtp__grid-item dtp__time_part">{{ pad2(day) }}</span>  -->
      <tap-to-input :editable="props.editableTime" id="dtp__day" class="dtp__grid-item dtp__time_part" :min="limits.day.min" :max="limits.day.max" pad2 v-model="day" />
      <span class="dtp__middle-slot"><slot name="center-middle"></slot></span>
      <!-- <span id="dtp__hour" class="dtp__grid-item dtp__time_part">{{ pad2(displayHour) }}</span> -->
      <tap-to-input :editable="props.editableTime" id="dtp__hour" class="dtp__grid-item dtp__time_part" :min="limits.hour.min" :max="limits.hour.max" pad2 v-model="displayHour" />
      <span>:</span>
      <!-- <span id="dtp__minute" class="dtp__grid-item dtp__time_part">{{ pad2(minute) }}</span> -->
      <tap-to-input :editable="props.editableTime" id="dtp__minute" class="dtp__grid-item dtp__time_part" :min="limits.minute.min" :max="limits.minute.max" pad2 v-model="minute" />
      <span>:</span>
      <!-- <span id="dtp__second" class="dtp__grid-item dtp__time_part">{{ pad2(second) }}</span> -->
      <tap-to-input :editable="props.editableTime" id="dtp__second" class="dtp__grid-item dtp__time_part" :min="limits.second.min" :max="limits.second.max" pad2 v-model="second" />
      <!-- </span> -->

      <button id="dtp__year-up" class="dtp__grid-item" @click="decrement('year')">
        <v-icon>mdi-menu-down</v-icon>
      </button>
      <span></span>
      <button id="dtp__month-up" class="dtp__grid-item" @click="decrement('month')">
        <v-icon>mdi-menu-down</v-icon>
      </button>
      <slot name="bottom-middle"><span></span></slot>
      <button id="dtp__day-up" class="dtp__grid-item" @click="decrement('day')">
        <v-icon>mdi-menu-down</v-icon>
      </button>
      <span></span>
      <button id="dtp__hour-up" class="dtp__grid-item" @click="decrement('hour')">
        <v-icon>mdi-menu-down</v-icon>
      </button>
      <span></span>
      <button id="dtp__minute-up" class="dtp__grid-item" @click="decrement('minute')">
        <v-icon>mdi-menu-down</v-icon>
      </button>
      <span></span>
      <button id="dtp__second-up" class="dtp__grid-item" @click="decrement('second')">
        <v-icon>mdi-menu-down</v-icon>
      </button>
    </div>
    
    <div class="dtp__ampm" v-if="props.useAmpm">
      <button 
        name="set-am" 
        :class='["dtp__ampm-button", "dtp__ampm-am", { "dtp__ampm-active": isAm }]' 
        @click="isAm = true" 
        aria-label="Set AM"
        >AM</button>
      <button 
        name="set-pm" 
        :class='["dtp__ampm-button", "dtp__ampm-pm", { "dtp__ampm-active": !isAm }]' 
        @click="isAm = false" 
        aria-label="Set PM"
        >PM</button>
    </div>
  </div>
    
    <div class="dtp__bottom-content">
      <slot></slot>
    </div>
    <div v-if="props.debug" class="dtp__debug">
      <span>Local: {{ year }}-{{ pad2(month) }}-{{ pad2(day) }} {{ pad2(hour) }}:{{ pad2(minute) }}:{{ pad2(second) }}</span>
      <span>UTC: {{ utcDate(date) }} </span>
    </div>

  </div>

</template>


<script setup lang="ts">
import { ref, watch, computed, withDefaults } from 'vue';
import TapToInput from './TapToInput.vue';


export interface Props {
  debug?: boolean;
  useAmpm?: boolean;
  editableTime?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  debug: false,
  useAmpm: true,
  editableTime: true,
});


const date = defineModel({default: new Date('2027-01-01 12:00:00 UTC')});

const year = ref(date.value.getFullYear());
const month = ref(date.value.getMonth()+1);
const day = ref(date.value.getDate());
const hour = ref(date.value.getHours());
const minute = ref(date.value.getMinutes());
const second = ref(date.value.getSeconds());

// const ampm = ref(hour.value >= 12);


const isAm = computed({
  get: () => hour.value < 12,
  set: (value) => {
    if (value) {
      for (let i = 0; i < 12; i++) {
        decrement('hour');
      }
    } else {
      for (let i = 0; i < 12; i++) {
        increment('hour');
      }
    }
  }
});

// watch(ampm, (value) => { isAm.value = value;});

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
  day: { min: 1, max: _daysInMonth(month.value, year.value) },
  hour: { min: 0, max: 23 },
  minute: { min: 0, max: 59 },
  second: { min: 0, max: 59 },
}));

const units: Unit[] = ['second', 'minute', 'hour', 'day', 'month', 'year'];

function changeValue(unit: Unit, increment: boolean) {
  // recursive logic help courtesy of chatgpt :)
  const limit = limits.value[unit].max;
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
        values[unit].value = limits.value[unit].max;
      }
    }
  }
}

const displayHour = computed({
  get() {
    if (props.useAmpm) {
      const h = hour.value % 12;
      return h === 0 ? 12 : h;
    } else {
      return hour.value;
    }
  },
  set(value: number) {
    if (props.useAmpm) {
      if (value > 12 && value < 24) {
        hour.value = value;
        return;
      }
      if (isAm.value) {
        hour.value = value;
      } else {
        hour.value = value + 12;
      }
    } else {
      hour.value = value;
    }
  }
});
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
  padding-top: 1.5em;
  padding-bottom: 5px;
  padding-inline: 15px;
}

@media (max-width: 350px) {
  .dtp__container {
    font-size: 5vw;
  }
}

.dtp__grid-container {
  display: grid;
  grid-template-columns: repeat(11, 0fr);
  justify-items: center;
  justify-content: center;
  font-family: 'Noto Sans Mono', monospace;
  gap: 2px;
  margin-bottom: 10px;
}

.dtp__row {
  display: grid;
  grid-template-columns: 0fr 0fr;
  align-items: center;
  gap: 1em;
}

@media (max-width: 350px) {
  .dtp__row {
    display: grid;
    grid-template-columns: 0fr;
    grid-template-rows: 0fr 0fr;
    justify-items: center;
    gap: 2px;
  }
}

.dtp__grid-container > * {
  margin: 0;
  padding: 0;
  width: 100%;
}

.dtp__middle-slot {
  width: 1.5em;
}

.dtp__bottom-content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.dtp__grid-item {
  position: relative;
  // outline: 1px solid red;
  text-align: center;
}

span.dtp__button-label {
  font-size: 0.8em;
  // display: none;
  position:absolute;
  top: -5px;
  left: 50%;
  transform: translate(-50%, -50%);
  // outline: 1px solid red;
}

.dtp__ampm {
  display: grid;
  grid-template-columns: 3em;
  grid-template-rows: 0fr 0fr;
  gap: 1px;
}

.dtp__ampm-button {
  background-color: #444;
  color: #ccc;
  padding: 0;
  align-self: center;
  font-size: .9em;
  width: 4ch;
}

// for dtp__ampm-am/pm add only left right and top/bottom border raidus
.dtp__ampm-am {
  border: 1px solid var(--accent-color);
  border-top-left-radius: .75ch;
  border-top-right-radius: .75ch;
  border-bottom: none
}

.dtp__ampm-pm {
  border: 1px solid var(--accent-color);
  border-bottom-left-radius: .75ch;
  border-bottom-right-radius: .75ch;
  border-top: none
}

@media (max-width: 350px) { 
  .dtp__ampm {
    grid-template-columns: 0fr 0fr;
    grid-template-rows: 0fr;
    margin-bottom: 0.5em;
  }
  
  .dtp__ampm-am {
    border: 1px solid var(--accent-color);
    border-radius: 0;
    border-top-left-radius: .75ch;
    border-bottom-left-radius: .75ch;
    border-right: none;
  }
  
  .dtp__ampm-pm {
    border: 1px solid var(--accent-color);
    border-radius: 0;
    border-top-right-radius: .75ch;
    border-bottom-right-radius: .75ch;
    border-left: none;
  }
  
}

.dtp__ampm-active {
  color: var(--accent-color);
}

/* Chrome, Safari, Edge, Opera */
.dtp__container input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
.dtp__container  input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

input#dtp__year {
  width: 4ch;
}

input.dtp__time_part {
  width: 2.5ch;
}

</style>