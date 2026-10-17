<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import emailjs from "@emailjs/browser";
import { transitions } from "../../../animations";
import Social from "../../../components/Social.vue";

const contactElement = ref<HTMLElement | null>(null);
const contactForm = ref<HTMLFormElement | null>(null);

const isSending = ref(false);
const status = ref<"success" | "error" | null>(null);
const statusMessage = ref("");
const recipientEmail = "durvagoswami13@gmail.com";

onMounted(() => {
  if (contactElement.value) {
    transitions.contact.setup(contactElement.value);
  }
});

onUnmounted(() => {
  transitions.contact.destroy();
});

const sendMessage = async () => {
  if (!contactForm.value || isSending.value) return;

  status.value = null;
  statusMessage.value = "";

  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    status.value = "error";
    statusMessage.value =
      "The contact form is not configured yet. Please try again later.";
    return;
  }

  isSending.value = true;

  try {
    await emailjs.sendForm(serviceId, templateId, contactForm.value, {
      publicKey,
    });

    status.value = "success";
    statusMessage.value = "Message sent successfully! I'll get back to you soon.";

    contactForm.value.reset();
  } catch (error: unknown) {
  console.error("EmailJS submission failed:", error);

  const emailError = error as {
    status?: number;
    text?: string;
    message?: string;
  };

  status.value = "error";

  statusMessage.value =
    `Message failed${emailError.status ? ` (${emailError.status})` : ""}: ${
      emailError.text ||
      emailError.message ||
      "Open browser console for details."
    }`;
} finally {
    isSending.value = false;
  }
};
</script>

<template>
  <div class="contact grid" ref="contactElement">
    <div class="contact-content">
      <form
        ref="contactForm"
        class="contact-form"
        @submit.prevent="sendMessage"
      >
        <input type="hidden" name="to_email" :value="recipientEmail" />
        <div class="contact-field">
          <label for="contact-name">Name</label>

          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder="Your name"
            autocomplete="name"
            maxlength="100"
            required
          />
        </div>

        <div class="contact-field">
          <label for="contact-email">Email</label>

          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            maxlength="254"
            required
          />
        </div>

        <div class="contact-field">
          <label for="contact-message">Message</label>

          <textarea
            id="contact-message"
            name="message"
            placeholder="Tell me about your project..."
            rows="4"
            maxlength="5000"
            required
          ></textarea>
        </div>

        <button
          class="contact-submit"
          type="submit"
          :disabled="isSending"
          data-hoversound="hover"
        >
          {{ isSending ? "Sending..." : "Send Message" }}
          <span aria-hidden="true">↗</span>
        </button>

        <p
          v-if="statusMessage"
          class="contact-status"
          :class="`contact-status-${status}`"
          role="status"
          aria-live="polite"
        >
          {{ statusMessage }}
        </p>
      </form>

      <Social variant="background" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.contact {
  width: 100%;
  max-width: calc(var(--svw) * 100);
  overflow: hidden;
  min-height: calc(var(--lvh) * 100);

  padding: var(--space-outer);
  padding-top: calc(var(--height-header) + var(--space-xl));
  padding-bottom: calc(var(--space-xl) + var(--safe-bottom, 0px));

  @include mixins.mq("md") {
    padding-top: var(--space-xxl);
  }

  &-content {
    position: relative;
    align-self: start;
    justify-self: start;
    grid-column: 1 / 13;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-lg);
    width: 100%;
    min-width: 0;

    @include mixins.mq("sm") {
      grid-column: 1 / 9;
    }

    @include mixins.mq("md") {
      grid-column: 1 / 7;
    }

    @include mixins.mq("lg") {
      grid-column: 1 / 6;
    }
  }

  &-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    width: 100%;
    max-width: 420px;
  }

  &-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    width: 100%;

    label {
      color: var(--color-text-400);
      font-size: var(--font-size-sm);
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    input,
    textarea {
      width: 100%;
      min-width: 0;
      padding: 12px 14px;

      color: var(--color-text-400);
      background: rgba(233, 222, 208, 0.42);
      border: 1px solid rgba(45, 42, 36, 0.24);
      border-radius: var(--radius-md);

      font: inherit;
      /* 16px minimum stops iOS Safari from zooming in on focus */
      font-size: max(16px, var(--font-size-md));
      letter-spacing: 0.01em;

      transition:
        border-color 0.2s ease,
        background-color 0.2s ease,
        box-shadow 0.2s ease;

      &::placeholder {
        color: var(--color-text-300);
        opacity: 0.72;
      }

      &:hover {
        border-color: rgba(45, 42, 36, 0.5);
      }

      &:focus {
        outline: none;
        border-color: var(--color-orange-400);
        background: rgba(245, 239, 230, 0.85);
        box-shadow: 0 0 0 3px rgba(255, 132, 0, 0.12);
      }
    }

    textarea {
      min-height: 110px;
      resize: vertical;
      line-height: var(--line-height-copy);
    }
  }

  &-submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    align-self: flex-start;
    gap: var(--space-md);

    min-height: 48px;
    padding: 0 26px;

    color: var(--color-accent-text-400, var(--color-white-400));
    background: var(--color-accent-400, var(--color-orange-400));
    border: none;
    border-radius: 100px;

    font-family: inherit;
    font-size: var(--font-size-sm);
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;

    cursor: pointer;
    transition:
      transform 0.2s ease,
      background-color 0.2s ease,
      opacity 0.2s ease;

    span {
      font-size: 20px;
      line-height: 1;
    }

    &:hover:not(:disabled) {
      background: var(--color-hover, var(--color-black-400));
      transform: translateY(-2px);
    }

    &:focus-visible {
      outline: 2px solid var(--color-orange-400);
      outline-offset: 4px;
    }

    &:disabled {
      opacity: 0.6;
      cursor: wait;
    }
  }

  &-status {
    width: 100%;
    padding: var(--space-sm) var(--space-md);
    border-left: 3px solid var(--color-orange-400);
    background: rgba(233, 222, 208, 0.4);
    color: var(--color-text-400);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-copy);
    overflow-wrap: anywhere;

    &-success {
      border-left-color: #287446;
    }

    &-error {
      border-left-color: var(--color-orange-400);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact-submit {
    transition: none;
  }
}
</style>
