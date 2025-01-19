<template>
  <button
    class="BaseButton"
    :disabled="props.disabled"
    :data-variant="props.variant"
    :class="additionalClasses"
    :type="props.type"
    :style="{ minWidth: props.minWidth }"
  >
    <component
      class="inner"
      :is="props.href ? 'a' : 'span'"
      :target="props.target"
      :href="props.href"
    >
      <slot></slot>
    </component>
  </button>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  href: {
    type: String,
    required: false,
  },
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    required: false,
    default: 'button',
  },
  target: {
    type: String,
    required: false,
  },
  hoverEffect: {
    type: Boolean,
    required: false,
    default: true,
  },
  minWidth: {
    type: String,
    default: '280px',
  },
})

const additionalClasses = computed(() => {
  const classes: string[] = []
  if (props.hoverEffect) classes.push('withHoverEffect')
  return classes
})
</script>

<style scoped>
.BaseButton {
  padding: 8px 20px;
  border: 1px;
  color: #fff;
  background-color: #2e3a5a;
  display: flex;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
}

.BaseButton:hover {
  background-color: #373f55;
}

.BaseButton[disabled] {
  cursor: not-allowed;
  opacity: 0.2;
}

.BaseButton .inner {
  text-transform: uppercase;
  font-size: 20px;
  line-height: 20px;
  padding-top: 2px;
}
</style>
