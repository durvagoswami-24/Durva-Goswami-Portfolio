export type TagVariant =
  | "three"
  | "websockets"
  | "react"
  | "redis"
  | "gray"
  | "html"
  | "css"
  | "javascript"
  | "node"
  | "next"
  | "kubernetes"
  | "postgresql"
  | "ogl"
  | "glsl"
  | "vue"
  | "ecommerce"
  | "ai"
  | "typescript"
  | "tailwind"
  | "mongodb"
  | "express"
  | "mern"
  | "wordpress"
  | "elementor"
  | "woocommerce";

export const tagLabels = {
  three: "Three.js",
  websockets: "WebSockets",
  react: "React",
  redis: "Redis",
  gray: "Gray",
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  node: "Node.js",
  next: "Next.js",
  kubernetes: "Kubernetes",
  postgresql: "PostgreSQL",
  ogl: "OGL.js",
  glsl: "GLSL",
  vue: "Vue.js",
  ecommerce: "E-Commerce",
  ai: "AI & Cyber Tools",
  typescript: "TypeScript",
  tailwind: "Tailwind CSS",
  mongodb: "MongoDB",
  express: "Express.js",
  mern: "MERN Stack",
  wordpress: "WordPress",
  elementor: "Elementor",
  woocommerce: "WooCommerce",
} as const satisfies Record<TagVariant, string>;
