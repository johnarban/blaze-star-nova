<!-- Input/Display with up down arrow above and below -->
<template>
    <span 
      v-if="!editing || !props.editable"
      @click="editing = !editing"
      ref="display"
      class="tti__display"
      >{{ pad(psuedoValue) }}
    </span>
    <input 
      v-else
      type="number" 
      :min="minValue"
      :max="maxValue"
      :step="stepValue"
      :value="psuedoValue" 
      @change="setValue"
      @blur="blurred"
      ref="input"
      class="tti__input"
      />
</template>

<script setup lang="ts">
import { ref, withDefaults, watch, computed } from 'vue';

const value = defineModel({ default: 0 });
const psuedoValue = ref(value.value);

const editing = ref(false);
const input = ref();

export interface Props {
  editable?: boolean;
  min?: string | number
  max?: string | number ;
  step?: number;
  clamp?: boolean;
  zeroPad?: number;
  pad2?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  min: 0,
  max: 9999,
  step: 1,
  clamp: false,
  zeroPad: 0,
  pad2: false,
});

function pad(value: number) {
  if (props.zeroPad > 0) {
    return value.toString().padStart(props.zeroPad, '0');
  }
  if (props.pad2) {
    return value.toString().padStart(2, '0');
  }
  return value;
}

const parseValue = (value: string | number | CallableFunction) => {
  if (typeof value === 'number') {
    return value;
  } 
  if (typeof value === 'function') {
    return value();
  }
  return value.includes('.') ? parseFloat(value) : parseInt(value);
};

const minValue = ref(parseValue(props.min));
const maxValue = ref(parseValue(props.max));
const stepValue = ref(parseValue(props.step));

function setValue(event: Event) {
  if (event.target) {
    psuedoValue.value = parseInt((event.target as HTMLInputElement).value);
  }
}

function blurred() {
  editing.value = false;
}

function round(value, toNearest) {
  return Math.round(value / toNearest) * toNearest;
}

const isValid = computed(() => {
  if (psuedoValue.value < minValue.value) {
    return false;
  }
  if (psuedoValue.value > maxValue.value) {
    return false;
  }
  return true;
});

function clampValue(value: number) {
  if (!props.clamp) {
    return value;
  }
  if (value < minValue.value) {
    value = minValue.value;
  } else if (value > maxValue.value) {
    value = maxValue.value;
  }
  if ((value % stepValue.value) !== 0) {
    value = round(value, stepValue.value);
  }
  return value;
}

// watch props
watch(() => props.min, (newVal) => {
  minValue.value = parseValue(newVal);
  psuedoValue.value = clampValue(psuedoValue.value);
});

watch(() => props.max, (newVal) => {
  maxValue.value = parseValue(newVal);
  psuedoValue.value = clampValue(psuedoValue.value);
});

watch(() => props.step, (newVal) => {
  stepValue.value = parseValue(newVal);
});

watch(value, (newVal) => {
  psuedoValue.value = clampValue(newVal);
});


watch(input, (value) => {
  if (value) {
    value.focus();
  }    
});

watch(psuedoValue, (newValue, oldValue) => {
  if (isValid.value) {
    value.value = psuedoValue.value;
    return;
  }
  if (props.clamp) {
    psuedoValue.value = clampValue(newValue);
    value.value = psuedoValue.value;
    return;
  }
  psuedoValue.value = oldValue;
  
});

</script>

<style>
/* Chrome, Safari, Edge, Opera */
input.tti__input::-webkit-outer-spin-button,
input.tti__input::-webkit-inner-spin-button
{
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input.tti__input[type='number']
{
  -moz-appearance: textfield;
  -webkit-appearance: textfield;
  appearance: textfield;
}

input.tti__input[type='number']
{
  text-align: center;
}

input.tti__input[type='number']:invalid
{
  background-color: #fd6969;
}

</style>
