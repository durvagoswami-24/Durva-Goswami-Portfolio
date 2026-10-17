import thumbnailBFMTimes from "../../../assets/thumbnails/bfm-times.svg";
import thumbnailAvikansaDivine from "../../../assets/thumbnails/avikansa-divine.svg";
import type { ProjectPreview } from "../../types";

export default [
  {
    title: "BFM Times | News & Magazine",
    slug: "bfm-times",
    thumbnail: thumbnailBFMTimes,
    description: "WordPress education news and magazine website",
    liveUrl: "https://bfmtimes.com/",
  },
  {
    title: "Avikansa Divine",
    slug: "avikansa-divine",
    thumbnail: thumbnailAvikansaDivine,
    description: "Wellness and spiritual services website built with WordPress",
    liveUrl: "https://avikansadivine.com/",
  },
] as const satisfies ProjectPreview[];
