import thumbnail from "../../../assets/thumbnails/bfm-times.svg";
import type { ProjectContent } from "../../types";

export default {
  title: "BFM Times | News & Magazine",
  theme: "dark",
  tags: ["wordpress", "elementor", "html", "css"],
  live: "https://bfmtimes.com/",
  description:
    "A professional education news and magazine website built with WordPress and Elementor.<br/><br/>The project focuses on clear content flow, readable editorial layouts, and a responsive experience across mobile and desktop.",
  components: [
    {
      type: "media",
      props: {
        type: "image",
        src: thumbnail,
        alt: "BFM Times news and magazine project",
        caption: "Responsive WordPress news and magazine experience",
      },
    },
  ],
} as const satisfies ProjectContent;
