import thumbnail from "../../../assets/thumbnails/avikansa-divine.svg";
import type { ProjectContent } from "../../types";

export default {
  title: "Avikansa Divine",
  theme: "dark",
  tags: ["wordpress"],
  live: "https://avikansadivine.com/",
  description:
    "A wellness and spiritual services website designed and developed with WordPress.<br/><br/>Custom layouts, content management, and responsive UI help visitors explore the services through a clear, user-friendly experience.",
  components: [
    {
      type: "media",
      props: {
        type: "image",
        src: thumbnail,
        alt: "Avikansa Divine wellness website project",
        caption: "Responsive website showcasing wellness and spiritual services",
      },
    },
  ],
} as const satisfies ProjectContent;
