<script setup lang="ts">
import HeaderLink from "./HeaderLink.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { t } from "../i18n/utils/translate";
import { lenis } from "../composables/useScroll";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useHeaderTheme } from "../composables/useHeaderTheme";
import { projectId } from "../composables/useRouteObserver";

const handleLinkClick = (link: string) => {
  if (!lenis.value) return;
  lenis.value.scrollTo(link);
};

type ActiveLink = "about" | "projects" | "contact";
const activeLink = ref<ActiveLink | null>(null);
const sections: ActiveLink[] = ["about", "projects", "contact"];
const ariaLabels = {
  about: t("about"),
  projects: t("projects"),
  contact: t("contact"),
};

const isMounted = ref(false);
const barStyle = ref({ transform: "", width: "128px" });

const { isDarkTheme, hasScrolledIntoView } = useHeaderTheme();

const getItemWidth = () => {
  if (typeof window === "undefined") return 128;
  if (window.innerWidth < 340) return 68;
  if (window.innerWidth < 380) return 78;
  if (window.innerWidth < 440) return 86;
  if (window.innerWidth < 768) return 96;
  if (window.innerWidth < 1024) return 112;
  return 128;
};

const updateBarPosition = () => {
  const width = getItemWidth();
  const index = sections.indexOf(activeLink.value as ActiveLink);
  const left = index * width;
  barStyle.value = {
    transform: `translateX(${left}px)`,
    width: `${width}px`,
  };
};

onMounted(() => {
  window.addEventListener("resize", updateBarPosition);

  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: `#${section}`,
      start: section === "about" ? "top 22.5%" : "top center",
      end: "bottom center",
      onEnter: () => {
        activeLink.value = section;
        updateBarPosition();
      },
      onEnterBack: () => {
        activeLink.value = section;
        updateBarPosition();
      },
      onLeave: () => (activeLink.value = null),
      onLeaveBack: () => (activeLink.value = null),
    });
  });

  ScrollTrigger.refresh();
  updateBarPosition();
  isMounted.value = true;
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", updateBarPosition);
  }
});
</script>

<template>
  <div :class="['header-home', { 'header-home-mounted': isMounted, 'header-home-isProjectPage': projectId !== null }]">
    <div :class="['header-home-links', { 'header-home-links-dark': isDarkTheme }]">
      <div
        :class="[
          'header-home-bar',
          { 'header-home-bar-active': activeLink !== null && hasScrolledIntoView, 'header-home-bar-dark': isDarkTheme },
        ]"
        :style="barStyle"
      ></div>
      <HeaderLink
        v-for="section in sections"
        :key="section"
        :is-active="activeLink === section"
        :class="[
          'header-home-link',
          { 'header-home-link-active': activeLink === section && hasScrolledIntoView },
          'children-unclickable',
        ]"
        @click="handleLinkClick('#' + section)"
        :is-dark-theme="isDarkTheme"
        :aria-label="ariaLabels[section]"
        data-sound="click"
        data-hoversound="hover"
      >
        {{ t(section) }}
      </HeaderLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-home {
  position: fixed;
  top: calc(8px + var(--safe-top));
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-index-header-home);
  height: var(--height-header);
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: calc(100vw - var(--space-outer) * 2);
  opacity: 0;
  transition:
    opacity 0.3s ease-in-out,
    transform var(--transition-route-duration) var(--transition-route-ease);

  &-isProjectPage {
    transform: translateX(-50%) translateY(-100%);
  }

  &-mounted {
    opacity: 1;
  }

  &-links {
    position: relative;
    display: flex;
    padding: 3px;
    background-color: var(--color-beige-500);
    border-radius: 100px;
    color: var(--color-text-400);
    max-width: 100%;
    overflow: hidden;
    transition:
      color 0.1s ease-in-out,
      background-color 0.1s ease-in-out;

    &-dark {
      background-color: var(--color-dark-blue-500);
      color: var(--color-white-400);
    }
  }

  &-bar {
    position: absolute;
    top: 3px;
    left: 3px;
    height: calc(100% - 6px);
    width: 128px;
    background: var(--color-orange-400);
    border-radius: 100px;
    transition:
      transform 0.3s var(--ease-smooth),
      width 0.3s var(--ease-smooth),
      opacity 0.1s ease-in-out,
      background-color 0.1s ease-in-out;
    z-index: 1;
    opacity: 0;

    &-dark {
      background-color: var(--color-cyan-500);
    }

    &-active {
      opacity: 1;
    }
  }

  &-link {
    position: relative;
    z-index: 2;
    letter-spacing: 0.01em;
    font-weight: 700;
    border: none;
    background: none;
    transition: color 0.1s ease-in-out;
    font-size: 10px;
    width: 68px;
    white-space: nowrap;
    text-transform: uppercase;

    @media (min-width: 340px) {
      font-size: 10.5px;
      width: 78px;
    }

    @media (min-width: 380px) {
      font-size: 11px;
      width: 86px;
    }

    @media (min-width: 440px) {
      font-size: 12px;
      width: 96px;
    }

    @media (min-width: 768px) {
      font-size: 14px;
      width: 112px;
    }

    @include mixins.mq("lg") {
      font-size: var(--font-size-md);
      width: 128px;
    }

    &-active {
      color: var(--color-white-400);
    }
  }
}
</style>
