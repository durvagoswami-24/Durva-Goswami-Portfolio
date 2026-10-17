import thumbnailBFMTimes from "../../../assets/thumbnails/bfm-times.svg";
import thumbnailAvikansaDivine from "../../../assets/thumbnails/avikansa-divine.svg";
import type { ProjectPreview } from "../../types";

export default [
  {
    title: "BFM Times | Nachrichten & Magazin",
    slug: "bfm-times",
    thumbnail: thumbnailBFMTimes,
    description: "WordPress-Nachrichten- und Magazinwebsite für Bildung",
    liveUrl: "https://bfmtimes.com/",
  },
  {
    title: "Avikansa Divine",
    slug: "avikansa-divine",
    thumbnail: thumbnailAvikansaDivine,
    description: "WordPress-Website für Wellness und Spiritualität",
    liveUrl: "https://avikansadivine.com/",
  },
] as const satisfies ProjectPreview[];
