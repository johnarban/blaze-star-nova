<!-- Input/Display with up down arrow above and below -->
<template>
  <div class="ri__container">
    <button @click="increment"><v-icon>mdi-menu-up</v-icon></button>
    <input 
      class="ri__input" 
      type="number" 
      :min="minValue"
      :max="maxValue"
      :step="stepValue"
      :value="value" 
      @change="setValue"
      />
    <button @click="decrement"><v-icon>mdi-menu-down</v-icon></button>
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults, watch } from 'vue';

const value = defineModel({ default: 0 });


export interface Props {
  min?: string | number
  max?: string | number;
  step?: number;

}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 9999,
  step: 1,
  clamp: false,
  pad: false,
  pad2: false,
});

const parseValue = (value: string | number) => {
  if (typeof value === 'number') {
    return value;
  } 
  return value.includes('.') ? parseFloat(value) : parseInt(value);
};

const minValue = ref(parseValue(props.min));
const maxValue = ref(parseValue(props.max));
const stepValue = ref(parseValue(props.step));

function setValue(event: Event) {
  if (event.target) {
    value.value = parseInt((event.target as HTMLInputElement).value);
  }
}

const increment = () => {
  if (value.value < maxValue.value) {
    value.value++;
  } else {
    value.value = minValue.value;
  }
};

const decrement = () => {
  if (value.value > minValue.value) {
    value.value--;
  } else {
    value.value = maxValue.value;
  }
};

function round(value, toNearest) {
  return Math.round(value / toNearest) * toNearest;
}

function clampValue() {
  if (!props.clamp) {
    return;
  }
  if (value.value < minValue.value) {
    value.value = minValue.value;
  } else if (value.value > maxValue.value) {
    value.value = maxValue.value;
  }
  if ((value.value % stepValue.value) !== 0) {
    value.value = round(value.value, stepValue.value);
  }
}

// watch props
watch(() => props.min, (newVal) => {
  minValue.value = parseValue(newVal);
  clampValue();
});

watch(() => props.max, (newVal) => {
  maxValue.value = parseValue(newVal);
  clampValue();
});

watch(() => props.step, (newVal) => {
  stepValue.value = parseValue(newVal);
});

watch(value, () => {
  clampValue();
});

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@500&display=swap');

.ri__container
{
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(3, 1fr);
  align-items: center;
  border: none;
  width: fit-content;
}

.ri__container>*
{
  border: none;
}

/* Chrome, Safari, Edge, Opera */
input.ri__input::-webkit-outer-spin-button,
input.ri__input::-webkit-inner-spin-button
{
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input.ri__input[type='number']
{
  -moz-appearance: textfield;
}

input.ri__input[type='number']
{
  width: 6ch;
  font-size: 1em;
  text-align: center;
  color: currentColor;
  font-family: 'Noto Sans Mono';
}
</style>
