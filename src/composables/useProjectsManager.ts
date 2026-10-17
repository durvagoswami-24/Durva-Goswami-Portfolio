import { ref, computed } from "vue";
import type { TagVariant } from "../components/tagVariants";

import thumbnailBFMTimes from "../assets/thumbnails/bfm-times.svg";
import thumbnailAvikansaDivine from "../assets/thumbnails/avikansa-divine.svg";

export interface ManagedProject {
id: string;
title: string;
slug: string;
description: string;
detailedDescription?: string;
category: "all" | "ai" | "ecommerce" | "education";
tags: TagVariant[];
thumbnail: string;
liveUrl?: string;
githubUrl?: string;
isCustom?: boolean;
}

const STORAGE_KEY = "fardeen_portfolio_all_projects_v1";
const DELETED_KEY = "fardeen_portfolio_deleted_ids";
const PASSWORD_KEY = "fardeen_portfolio_admin_password";

// Default core projects
const DEFAULT_PROJECTS: ManagedProject[] = [
{
  id: "bfm-times",
  title: "BFM Times | News & Magazine",
  slug: "bfm-times",
  description: "WordPress education news and magazine website",
  detailedDescription:
    "A professional education news and magazine website built with WordPress and Elementor. The project focuses on clear content flow, readable editorial layouts, and a responsive experience across mobile and desktop.",
  category: "education",
  tags: ["wordpress", "elementor", "html", "css"],
  thumbnail: thumbnailBFMTimes,
  liveUrl: "https://bfmtimes.com/",
},
{
id: "avikansa-divine",
title: "Avikansa Divine",
slug: "avikansa-divine",
description: "Wellness and spiritual services website built with WordPress",
detailedDescription:
"A wellness and spiritual services website designed and developed with WordPress. Custom layouts, content management, and responsive UI help visitors explore the services through a clear, user-friendly experience.",
category: "all",
tags: ["wordpress"],
thumbnail: thumbnailAvikansaDivine,
liveUrl: "https://avikansadivine.com/",
},
];

const projectsState = ref<ManagedProject[]>([]);
const deletedIdsState = ref<string[]>([]);

function loadState() {
if (typeof window === "undefined") return;

try {
const rawDeleted = localStorage.getItem(DELETED_KEY);


if (rawDeleted) {
  deletedIdsState.value = JSON.parse(rawDeleted);
}

const rawProjects = localStorage.getItem(STORAGE_KEY);

if (rawProjects) {
  const stored = JSON.parse(rawProjects);

  const merged = DEFAULT_PROJECTS.filter(
    (p) => !deletedIdsState.value.includes(p.id),
  );

  stored.forEach((sp: ManagedProject) => {
    if (
      sp.isCustom &&
      !merged.some((m) => m.id === sp.id) &&
      !deletedIdsState.value.includes(sp.id)
    ) {
      merged.push(sp);
    }
  });

  projectsState.value = merged;
} else {
  projectsState.value = DEFAULT_PROJECTS.filter(
    (p) => !deletedIdsState.value.includes(p.id),
  );
}

saveState();


} catch (err) {
console.error("Failed to load projects state", err);
projectsState.value = [...DEFAULT_PROJECTS];
}
}

function saveState() {
if (typeof window === "undefined") return;

try {
localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsState.value));
localStorage.setItem(DELETED_KEY, JSON.stringify(deletedIdsState.value));
} catch (err) {
console.error("Failed to save projects state", err);
}
}

// Initial load
loadState();

export function useProjectsManager() {
const allProjects = computed(() => {
return projectsState.value.filter(
(p) => !deletedIdsState.value.includes(p.id),
);
});

const selectedCategory = ref<string>("all");
const searchQuery = ref<string>("");

const filteredProjects = computed(() => {
return allProjects.value.filter((p) => {
const matchCat =
selectedCategory.value === "all" ||
p.category === selectedCategory.value ||
p.tags.includes(selectedCategory.value as TagVariant);

  const matchQuery =
    searchQuery.value.trim() === "" ||
    p.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.value.toLowerCase());

  return matchCat && matchQuery;
});


});

const addProject = (
projectData: Omit<ManagedProject, "id" | "isCustom">,
) => {
const newId = projectData.slug || `proj_${Date.now()}`;

const newProj: ManagedProject = {
  ...projectData,
  id: newId,
  slug: newId,
  isCustom: true,
};

projectsState.value.push(newProj);
saveState();

return newProj;


};

const updateProject = (
id: string,
updatedData: Partial<ManagedProject>,
) => {
const current = projectsState.value.find((p) => p.id === id);

if (current) {
  Object.assign(current, updatedData);
  saveState();
}


};

const deleteProject = (id: string) => {
if (!deletedIdsState.value.includes(id)) {
deletedIdsState.value.push(id);
}


projectsState.value = projectsState.value.filter((p) => p.id !== id);
saveState();


};

const exportJSON = () => {
const dataStr = JSON.stringify(allProjects.value, null, 2);
const blob = new Blob([dataStr], { type: "application/json" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");

a.href = url;
a.download = `durva_portfolio_projects_${Date.now()}.json`;
a.click();

URL.revokeObjectURL(url);


};

const importJSON = (jsonString: string) => {
try {
const parsed = JSON.parse(jsonString);


  if (Array.isArray(parsed)) {
    projectsState.value = parsed;
    deletedIdsState.value = [];
    saveState();
    return true;
  }
} catch (err) {
  console.error("Invalid JSON import", err);
}

return false;


};

const resetToDefault = () => {
projectsState.value = [...DEFAULT_PROJECTS];
deletedIdsState.value = [];


if (typeof window !== "undefined") {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DELETED_KEY);
}


};

const DEFAULT_HASH =
"240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

const hashPassword = async (pwd: string): Promise<string> => {
if (
typeof window === "undefined" ||
!window.crypto ||
!window.crypto.subtle
) {
return pwd;
}


const msgUint8 = new TextEncoder().encode(pwd);
const hashBuffer = await window.crypto.subtle.digest(
  "SHA-256",
  msgUint8,
);
const hashArray = Array.from(new Uint8Array(hashBuffer));

return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");


};

const getAdminPasswordHash = () => {
if (typeof window === "undefined") return DEFAULT_HASH;


return localStorage.getItem(PASSWORD_KEY) || DEFAULT_HASH;


};

const verifyPassword = async (inputPwd: string): Promise<boolean> => {
const inputHash = await hashPassword(inputPwd);
const storedHash = getAdminPasswordHash();


if (storedHash === inputHash || storedHash === inputPwd) {
  return true;
}

return false;


};

const setAdminPassword = async (newPassword: string) => {
if (typeof window === "undefined") return;


const newHash = await hashPassword(newPassword);
localStorage.setItem(PASSWORD_KEY, newHash);


};

return {
allProjects,
filteredProjects,
selectedCategory,
searchQuery,
addProject,
updateProject,
deleteProject,
exportJSON,
importJSON,
resetToDefault,
verifyPassword,
setAdminPassword,
};
}
