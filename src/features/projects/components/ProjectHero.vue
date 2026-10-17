<script setup lang="ts">
import Tag from "../../../components/Tag.vue";
import Button from "../../../components/Button.vue";
import { t } from "../../../i18n/utils/translate";
import Link from "../../../components/Link.vue";
import { projectId } from "../../../composables/useRouteObserver";
import { ref, watch } from "vue";

import type { ProjectContent } from "../../../content/types";

const { content } = defineProps<{
  content: ProjectContent;
}>();

const animationKey = ref(0);

// Restart title animation when the project changes
watch(projectId, () => {
  animationKey.value++;
});
</script>

<template>
  <div class="project-hero grid">
    <div class="project-hero-top">
      <div class="project-hero-title-wrapper">
        <h1
          class="project-hero-title"
          :key="animationKey"
        >
          {{ content.title }}
        </h1>
      </div>

      <div class="project-hero-tags">
        <Tag
          v-for="tag in content.tags"
          :key="tag"
          :variant="tag"
        />
      </div>
    </div>

    <p
      class="project-hero-description"
      v-html="content.description"
    ></p>

    <div class="project-hero-buttons">
      <Link
        v-if="content.live"
        :href="content.live"
        external
        class="project-hero-button"
        data-cursor="arrow-external"
      >
        <Button
          renderAs="div"
          variant="accent"
          class="children-unclickable"
          data-hoversound="hover"
        >
          {{ t("live-view") }}
        </Button>
      </Link>

      <Link
        v-if="content.source"
        :href="content.source"
        external
        class="project-hero-button"
        data-cursor="arrow-external"
      >
        <Button
          renderAs="div"
          variant="border"
          class="children-unclickable"
          data-hoversound="hover"
        >
          {{ t("source-code") }}
        </Button>
      </Link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.project-hero {
  min-width: 0;
  padding: 0 var(--space-outer);
  padding-top: calc(var(--height-header) + 24px);
  padding-bottom: 48px;

  @include mixins.mq("md") {
    padding-bottom: 64px;
  }

  &-top {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    grid-row: 1;
    align-self: start;
    grid-column: 1 / 13;
    width: 100%;
    min-width: 0;

    @include mixins.mq("md") {
      grid-column: 1 / 7;
    }

    @include mixins.mq("lg") {
      grid-column: 2 / 7;
    }
  }

  &-title-wrapper {
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
  }

  &-title {
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    margin: 0;
    color: var(--color-text-400);

    // Explicit font size instead of the oversized global title variables
    font-size: clamp(2rem, 4.8vw, 4rem);
    line-height: 1.04;
    letter-spacing: -0.035em;

    white-space: normal;
    overflow-wrap: anywhere;
    word-break: normal;
    hyphens: none;
    text-wrap: balance;

    transform: translateY(0);
    animation: project-hero-title-visible 0.5s var(--ease-smooth);

    @keyframes project-hero-title-visible {
      from {
        transform: translateY(100%);
      }

      to {
        transform: translateY(0);
      }
    }
  }

  &-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm);
    min-width: 0;
  }

  &-description {
    min-width: 0;
    align-self: center;
    grid-column: 1 / 13;
    color: var(--color-text-400);
    line-height: var(--line-height-copy);
    overflow-wrap: anywhere;

    @include mixins.mq("md") {
      grid-row: 1;
      grid-column: 7 / 13;
    }

    @include mixins.mq("lg") {
      grid-row: 1;
      grid-column: 7 / 12;
    }

    @include mixins.mq("xl") {
      grid-row: 1;
      grid-column: 7 / 11;
    }
  }

  &-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--space-sm);

    grid-row: 3;
    grid-column: 1 / 13;
    width: 100%;
    min-width: 0;
    margin-top: var(--space-md);

    @include mixins.mq("md") {
      justify-content: flex-start;
      flex-wrap: nowrap;
      gap: var(--space-md);
      width: fit-content;
      grid-column: 1 / 7;
      grid-row: 2;
      margin-top: 0;
    }

    @include mixins.mq("lg") {
      grid-column: 2 / 7;
    }
  }

  &-button {
    flex: 0 1 auto;
    min-width: 0;

    @include mixins.mq("md") {
      width: fit-content;
    }
  }

  &-video {
    grid-column: 1 / span 12;
    align-self: center;

    @include mixins.mq("md") {
      grid-column: 1 / 8;
    }

    @include mixins.mq("lg") {
      grid-column: 2 / 8;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-hero-title {
    animation: none;
    transform: none;
  }
}
</style>