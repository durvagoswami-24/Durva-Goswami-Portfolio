<script setup lang="ts">
import { computed } from "vue";
import { locale } from "../../../i18n/store";
import { t } from "../../../i18n/utils/translate";

const experience = computed(() =>
  locale.value === "en"
    ? [
        {
          role: "Web Developer Intern",
          company: "Discover Websoft · Indore",
          period: "April 2026 – Present",
          details: [
            "Maintain and update the company website, keeping its content accurate, responsive, and functional.",
            "Develop and improve website interfaces with HTML, CSS, JavaScript, and Tailwind CSS.",
            "Coordinate Instagram content updates and social media activity.",
          ],
        },
        {
          role: "WordPress Developer Intern",
          company: "Connect Shiksha Coding Community · Balaghat",
          period: "July 2025 – September 2025",
          details: [
            "Developed and customized responsive WordPress websites with Elementor and WooCommerce.",
            "Worked on layouts, plugin integration, UI improvements, and theme customization.",
            "Handled client project work through the development process.",
          ],
        },
        {
          role: "Full Stack Developer Intern",
          company: "Connect Shiksha Coding Community · Balaghat",
          period: "February 2025 – April 2025",
          details: [
            "Built responsive interface components with React.js and Tailwind CSS.",
            "Resolved UI and UX issues and optimized modules for faster load times.",
          ],
        },
      ]
    : [
        {
          role: "Webentwicklerin (Praktikum)",
          company: "Discover Websoft · Indore",
          period: "April 2026 – heute",
          details: [
            "Pflege und Aktualisierung der Unternehmenswebsite mit responsivem Design, korrekten Inhalten und zuverlässiger Funktion.",
            "Entwicklung und Verbesserung von Website-Oberflächen mit HTML, CSS, JavaScript und Tailwind CSS.",
            "Koordination von Instagram-Inhalten und Social-Media-Aktivitäten.",
          ],
        },
        {
          role: "WordPress-Entwicklerin (Praktikum)",
          company: "Connect Shiksha Coding Community · Balaghat",
          period: "Juli 2025 – September 2025",
          details: [
            "Entwicklung und Anpassung responsiver WordPress-Websites mit Elementor und WooCommerce.",
            "Arbeit an Layouts, Plugin-Integration, UI-Verbesserungen und Theme-Anpassungen.",
            "Mitarbeit an Kundenprojekten während des Entwicklungsprozesses.",
          ],
        },
        {
          role: "Full-Stack-Entwicklerin (Praktikum)",
          company: "Connect Shiksha Coding Community · Balaghat",
          period: "Februar 2025 – April 2025",
          details: [
            "Erstellung responsiver UI-Komponenten mit React.js und Tailwind CSS.",
            "Behebung von UI- und UX-Problemen und Optimierung der Ladezeiten.",
          ],
        },
      ],
);
</script>

<template>
  <section id="experience" class="experience" aria-labelledby="experience-title">
    <div class="experience-inner">
      <header class="experience-header">
        <h2 id="experience-title" class="experience-title">{{ t("work-experience") }}</h2>
      </header>

      <div class="experience-list">
        <article v-for="item in experience" :key="`${item.role}-${item.period}`" class="experience-item">
          <p class="experience-period">{{ item.period }}</p>
          <div class="experience-copy">
            <h3 class="experience-role">{{ item.role }}</h3>
            <p class="experience-company">{{ item.company }}</p>
            <ul class="experience-details">
              <li v-for="detail in item.details" :key="detail">{{ detail }}</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.experience {
  width: 100%;
  padding: calc(var(--space-xxl) + var(--space-lg)) var(--space-outer);
  background-color: var(--color-background-400);
  color: var(--color-text-400);

  @include mixins.mq("md") {
    padding-top: 144px;
    padding-bottom: 144px;
  }

  &-inner {
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
  }

  &-header {
    margin-bottom: var(--space-xl);

    @include mixins.mq("md") {
      margin-bottom: var(--space-xxl);
    }
  }

  &-title {
    font-size: var(--font-size-title-md);
    font-weight: 900;
    letter-spacing: 0.02em;

    @include mixins.mq("sm") {
      font-size: var(--font-size-title-lg);
    }

    @include mixins.mq("xl") {
      font-size: var(--font-size-title-xl);
    }
  }

  &-item {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-sm);
    padding: var(--space-lg) 0;
    border-top: 1px solid var(--color-grayscale-400);

    @include mixins.mq("md") {
      grid-template-columns: minmax(180px, 0.7fr) minmax(0, 2fr);
      gap: var(--space-xl);
      padding: var(--space-xl) 0;
    }
  }

  &-period {
    color: var(--color-text-300);
    font-size: var(--font-size-sm);
    font-weight: 700;
  }

  &-role {
    font-size: var(--font-size-title-xs);
    font-weight: 800;
  }

  &-company {
    margin-top: var(--space-xxs);
    color: var(--color-orange-400);
    font-size: var(--font-size-md);
    font-weight: 700;
    overflow-wrap: anywhere;
  }

  &-details {
    display: grid;
    gap: var(--space-xs);
    margin: var(--space-sm) 0 0;
    padding-left: 0;
    list-style: none;
    color: var(--color-text-300);
    font-size: var(--font-size-md);
    line-height: var(--line-height-copy);

    li {
      position: relative;
      padding-left: 1.25rem;
    }

    li::before {
      content: "";
      position: absolute;
      top: 0.68em;
      left: 0;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: var(--color-orange-400);
    }
  }
}
</style>
