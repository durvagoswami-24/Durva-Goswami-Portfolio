<script setup>
import Button from "../../../components/Button.vue";
import Banner from "../../../components/Banner.vue";
import { preloaderVisible } from "../../../composables/usePreloader";
import { t } from "../../../i18n/utils/translate";
import AppearingText from "../../../components/AppearingText.vue";
</script>

<template>
  <div class="hero">
    <div class="hero-content grid">
      <div class="hero-content-inner" id="hero-content-inner">
        <div class="hero-content-copys">
          <h1 class="hero-title">Durva<br />Goswami</h1>
          <Banner class="hero-banner" :copy="t('job-title')" v-if="!preloaderVisible" animated />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hero {
  min-height: 100dvh;
  height: 100dvh;
  width: 100%;
  display: flex;
  position: relative;
  overflow: hidden;

  &-content {
    align-items: center;
    justify-content: center;
    height: 46%;

    @include mixins.landscape {
      height: 100%;

      @include mixins.mq("md") {
        padding-bottom: 30%;
      }

      @include mixins.mq("lg") {
        padding-bottom: 5%;
      }
    }

    &-inner {
      transform-origin: center center;
      grid-column: 1 / 13;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: fit-content;
      max-width: calc(100vw - 2 * var(--space-outer));
      position: relative;
      left: 50%;
      transform: translateX(-50%);

      @include mixins.landscape {
        left: 0;
        transform: translateX(0);
        grid-column: 2 / 13;
        width: fit-content;
      }
    }

    &-copys {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      width: fit-content;
      max-width: 100%;

      @include mixins.mq("md") {
        gap: var(--space-md);
      }
    }

    &-button {
      width: fit-content;
    }
  }

  &-title {
    font-weight: 900;
    letter-spacing: 0.02em;
    font-size: clamp(2.75rem, 9vw, 7rem);
    line-height: 0.94;
    max-width: 100%;
    text-wrap: balance;

    @include mixins.landscape {
      font-size: clamp(3rem, 8vw, 7rem);
    }

    @include mixins.landscape-large {
      @include mixins.mq("sm") {
        font-size: var(--font-size-title-xl);
      }

      @include mixins.mq("xl") {
        font-size: var(--font-size-title-xxl);
      }
    }
  }

  &-banner {
    position: relative;
    align-self: flex-end;
    margin-top: var(--space-xs);
    max-width: min(420px, 100%);
    z-index: 10;
    transform: rotate(-3deg);
  }
}
</style>
