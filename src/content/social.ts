export const social = [
  {
    url: "https://wa.me/918602630043",
    name: "whatsapp",
  },
  {
    url: "https://github.com/durvagoswami-24",
    name: "github",
  },
  {
    url: "https://www.linkedin.com/in/durva-goswami-093801263",
    name: "linkedin",
  },
] as const satisfies {
  url: string;
  name: "mail" | "github" | "instagram" | "x" | "linkedin" | "whatsapp";
}[];
