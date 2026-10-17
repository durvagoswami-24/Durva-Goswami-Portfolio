<script setup lang="ts">
import { computed } from "vue";
import { tagLabels, type TagVariant } from "./tagVariants";

const props = defineProps<{
  variant: TagVariant;
}>();

const classes = computed(() => ["tag", `tag-variant-${props.variant}`]);
</script>

<template>
  <div :class="classes">
    <p class="tag-copy">{{ tagLabels[props.variant] }}</p>
  </div>
</template>

<style scoped lang="scss">
.tag {
  border-radius: var(--radius-md);
  padding: calc(var(--space-xxs) - var(--stroke-md)) calc(var(--space-sm  ) - var(--stroke-md));
  border: var(--stroke-md) solid transparent;

  &-copy {
    font-size: var(--font-size-xs);
    font-weight: 700;
  }

  &-variant {
    &-three {
      background-color: #ed9c55;
      color: #492708;
    }

    &-react {
      background-color: #61dafb;
      color: #0f2e36;
    }

    &-websockets {
      background-color: #2674a4;
      color: white;
    }

    &-redis {
      background-color: #ce4036;
      color: white;
    }

    &-html {
      color: var(--color-text-400);
      border-color: var(--color-grayscale-400);
    }

    &-css {
      color: var(--color-text-400);
      border-color: var(--color-grayscale-400);
    }

    &-javascript {
      background-color: #ffdf4f;
      color: #362d03;
    }

    &-node {
      background-color: #237d23;
      color: white;
    }

    &-next {
      background-color: #000000;
      color: #ffffff;
      border-color: #333333;
    }

    &-vue {
      background-color: #42b883;
      color: #0f2e23;
    }

    &-tailwind {
      background-color: #38bdf8;
      color: #0f172a;
    }

    &-mongodb {
      background-color: #47a248;
      color: #ffffff;
    }

    &-express {
      background-color: #353535;
      color: #ffffff;
    }

    &-mern {
      background-color: #00b4d8;
      color: #03045e;
    }

    &-typescript {
      background-color: #3178c6;
      color: #ffffff;
    }

    &-ecommerce {
      background-color: #9333ea;
      color: #ffffff;
    }

    &-ai {
      background-color: #2563eb;
      color: #ffffff;
    }

    &-kubernetes {
      background-color: #326ce5;
      color: white;
    }

    &-postgresql {
      background-color: #2f6c92;
      color: white;
    }

    &-ogl {
      background-color: #0e5495;
      color: white;
    }

    &-glsl {
      background-color: #95630e;
      color: white;
    }

    &-wordpress {
      background-color: #21759b;
      color: white;
    }

    &-elementor {
      background-color: #92003b;
      color: white;
    }

    &-woocommerce {
      background-color: #96588a;
      color: white;
    }
  }
}
</style>
