<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useProjectsManager, type ManagedProject } from "../../composables/useProjectsManager";
import type { TagVariant } from "../../components/tagVariants";

const {
  allProjects,
  addProject,
  updateProject,
  deleteProject,
  exportJSON,
  importJSON,
  resetToDefault,
  verifyPassword,
  setAdminPassword,
} = useProjectsManager();

const isAuthenticated = ref(false);
const emailInput = ref("");
const passwordInput = ref("");
const showPassword = ref(false);
const authError = ref(false);
const authErrorMessage = ref("❌ Invalid Email or Password!");

// Security & Rate Limiting
const failedAttempts = ref(0);
const lockoutEndTime = ref<number | null>(null);
const lockoutSecondsRemaining = ref(0);
let lockoutTimer: any = null;

const DEFAULT_EMAIL = "shahidkhan20201977@gmail.com";
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const SESSION_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

// Password Change State
const showPasswordChange = ref(false);
const newPasswordInput = ref("");
const confirmPasswordInput = ref("");
const passwordChangeSuccess = ref(false);
const passwordChangeError = ref("");

// Editing State
const editingProjectId = ref<string | null>(null);

const checkLockoutStatus = () => {
  if (typeof window === "undefined") return;
  const storedLockout = localStorage.getItem("fardeen_admin_lockout_until");
  if (storedLockout) {
    const until = parseInt(storedLockout, 10);
    if (Date.now() < until) {
      lockoutEndTime.value = until;
      startLockoutCountdown();
    } else {
      localStorage.removeItem("fardeen_admin_lockout_until");
      failedAttempts.value = 0;
    }
  }
};

const startLockoutCountdown = () => {
  if (lockoutTimer) clearInterval(lockoutTimer);
  lockoutTimer = setInterval(() => {
    if (!lockoutEndTime.value) return;
    const diff = Math.ceil((lockoutEndTime.value - Date.now()) / 1000);
    if (diff <= 0) {
      clearInterval(lockoutTimer);
      lockoutEndTime.value = null;
      lockoutSecondsRemaining.value = 0;
      failedAttempts.value = 0;
      localStorage.removeItem("fardeen_admin_lockout_until");
    } else {
      lockoutSecondsRemaining.value = diff;
    }
  }, 1000);
};

onMounted(() => {
  if (typeof window !== "undefined") {
    checkLockoutStatus();
    const sessionTimeStr = sessionStorage.getItem("fardeen_admin_auth_timestamp");
    const sessionAuth = sessionStorage.getItem("fardeen_admin_auth");

    if (sessionAuth === "true" && sessionTimeStr) {
      const sessionTime = parseInt(sessionTimeStr, 10);
      if (Date.now() - sessionTime < SESSION_EXPIRY_MS) {
        isAuthenticated.value = true;
      } else {
        handleLogout();
      }
    }
  }
});

onUnmounted(() => {
  if (lockoutTimer) clearInterval(lockoutTimer);
});

const handleLogin = async () => {
  if (lockoutEndTime.value && Date.now() < lockoutEndTime.value) {
    authError.value = true;
    authErrorMessage.value = `⛔ Account locked out due to multiple failed attempts. Try again in ${lockoutSecondsRemaining.value}s.`;
    return;
  }

  const cleanEmail = emailInput.value.trim().toLowerCase();
  if (cleanEmail !== DEFAULT_EMAIL.toLowerCase()) {
    recordFailedAttempt();
    return;
  }

  const isPasswordValid = await verifyPassword(passwordInput.value);

  if (isPasswordValid) {
    isAuthenticated.value = true;
    authError.value = false;
    failedAttempts.value = 0;
    passwordInput.value = "";
    if (typeof window !== "undefined") {
      sessionStorage.setItem("fardeen_admin_auth", "true");
      sessionStorage.setItem("fardeen_admin_auth_timestamp", Date.now().toString());
      localStorage.removeItem("fardeen_admin_lockout_until");
    }
  } else {
    recordFailedAttempt();
  }
};

const recordFailedAttempt = () => {
  failedAttempts.value += 1;
  authError.value = true;

  if (failedAttempts.value >= MAX_ATTEMPTS) {
    const until = Date.now() + LOCKOUT_DURATION_MS;
    lockoutEndTime.value = until;
    if (typeof window !== "undefined") {
      localStorage.setItem("fardeen_admin_lockout_until", until.toString());
    }
    startLockoutCountdown();
    authErrorMessage.value = `⛔ Too many failed attempts! Login locked for 5 minutes.`;
  } else {
    const remaining = MAX_ATTEMPTS - failedAttempts.value;
    authErrorMessage.value = `❌ Invalid Email or Password! (${remaining} attempts remaining before lockout)`;
  }
};

const handleLogout = () => {
  isAuthenticated.value = false;
  passwordInput.value = "";
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("fardeen_admin_auth");
    sessionStorage.removeItem("fardeen_admin_auth_timestamp");
  }
};

const handleChangePassword = async () => {
  if (!newPasswordInput.value) {
    passwordChangeError.value = "Password cannot be empty.";
    return;
  }
  if (newPasswordInput.value.length < 6) {
    passwordChangeError.value = "Password should be at least 6 characters long.";
    return;
  }
  if (newPasswordInput.value !== confirmPasswordInput.value) {
    passwordChangeError.value = "Passwords do not match!";
    return;
  }
  await setAdminPassword(newPasswordInput.value);
  passwordChangeSuccess.value = true;
  passwordChangeError.value = "";
  newPasswordInput.value = "";
  confirmPasswordInput.value = "";
  setTimeout(() => {
    showPasswordChange.value = false;
    passwordChangeSuccess.value = false;
  }, 2000);
};

// Form state
const title = ref("");
const description = ref("");
const detailedDescription = ref("");
const category = ref<"all" | "ai" | "ecommerce" | "education">("ecommerce");
const liveUrl = ref("");
const githubUrl = ref("");
const thumbnail = ref("");
const selectedTags = ref<TagVariant[]>(["vue", "ecommerce"]);

const availableTags: { value: TagVariant; label: string }[] = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "node", label: "Node.js" },
  { value: "next", label: "Next.js" },
  { value: "typescript", label: "TypeScript" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "ai", label: "AI & Cyber" },
  { value: "websockets", label: "WebSockets" },
  { value: "three", label: "Three.js" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "wordpress", label: "WordPress" },
  { value: "elementor", label: "Elementor" },
  { value: "woocommerce", label: "WooCommerce" },
];

const toggleTag = (tag: TagVariant) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((t) => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
};

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    thumbnail.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const startEditing = (proj: ManagedProject) => {
  editingProjectId.value = proj.id;
  title.value = proj.title;
  description.value = proj.description;
  detailedDescription.value = proj.detailedDescription || proj.description;
  category.value = proj.category;
  liveUrl.value = proj.liveUrl || "";
  githubUrl.value = proj.githubUrl || "";
  thumbnail.value = proj.thumbnail;
  selectedTags.value = [...proj.tags];
};

const cancelEditing = () => {
  editingProjectId.value = null;
  title.value = "";
  description.value = "";
  detailedDescription.value = "";
  liveUrl.value = "";
  githubUrl.value = "";
  thumbnail.value = "";
  selectedTags.value = ["vue", "ecommerce"];
};

const handleSubmit = () => {
  if (!title.value || !description.value || !liveUrl.value) {
    alert("Please fill in Title, Description, and Live URL.");
    return;
  }

  const slug = title.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  if (editingProjectId.value) {
    updateProject(editingProjectId.value, {
      title: title.value,
      slug: slug,
      description: description.value,
      detailedDescription: detailedDescription.value || description.value,
      category: category.value,
      tags: selectedTags.value,
      thumbnail: thumbnail.value,
      liveUrl: liveUrl.value,
      githubUrl: githubUrl.value || undefined,
    });
    alert("Project updated successfully!");
    cancelEditing();
  } else {
    addProject({
      title: title.value,
      slug: slug,
      description: description.value,
      detailedDescription: detailedDescription.value || description.value,
      category: category.value,
      tags: selectedTags.value,
      thumbnail: thumbnail.value || "/src/assets/thumbnails/kdbtools.webp",
      liveUrl: liveUrl.value,
      githubUrl: githubUrl.value || undefined,
    });
    alert("Project added successfully!");
    cancelEditing();
  }
};

const handleDelete = (proj: ManagedProject) => {
  if (confirm(`Are you sure you want to delete "${proj.title}" from your portfolio?`)) {
    deleteProject(proj.id);
  }
};

const handleFileImport = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const success = importJSON(e.target?.result as string);
    if (success) {
      alert("Projects imported successfully!");
    } else {
      alert("Invalid JSON format.");
    }
  };
  reader.readAsText(file);
};

const closeAdmin = () => {
  window.history.pushState({}, "", "/");
  window.dispatchEvent(new Event("route-change"));
};
</script>

<template>
  <div class="admin-overlay" @wheel.stop @touchmove.stop>
    <div class="admin-container">

      <!-- EMAIL & PASSWORD LOGIN DIALOG -->
      <div v-if="!isAuthenticated" class="admin-card auth-card">
        <div class="auth-header">
          <h2>🔒 Durva Goswami Admin Login</h2>
          <p>Sign in with administrative credentials to manage portfolio projects</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label>Email Address</label>
            <input
              v-model="emailInput"
              type="email"
              placeholder="Enter admin email address"
              required
              class="admin-input"
              :disabled="Boolean(lockoutEndTime && Date.now() < lockoutEndTime)"
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <div class="password-input-wrapper">
              <input
                v-model="passwordInput"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter admin password"
                required
                class="admin-input"
                :disabled="Boolean(lockoutEndTime && Date.now() < lockoutEndTime)"
              />
              <button
                type="button"
                class="toggle-pwd-btn"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? "👁️ Hide" : "👁️ Show" }}
              </button>
            </div>
          </div>

          <p v-if="authError" class="error-msg">
            {{ authErrorMessage }}
          </p>

          <button
            type="submit"
            class="admin-btn btn-primary btn-large"
            :disabled="Boolean(lockoutEndTime && Date.now() < lockoutEndTime)"
          >
            🔑 Sign In to Secure Dashboard
          </button>
        </form>

        <button @click="closeAdmin" class="admin-btn btn-secondary mt-16">
          ← Return to Portfolio
        </button>
      </div>

      <!-- MAIN ADMIN DASHBOARD -->
      <div v-else class="admin-dashboard">
        <header class="dashboard-header">
          <div>
            <h1>⚡ Durva Goswami Portfolio Admin</h1>
            <p>Signed in as: <strong>{{ emailInput }}</strong></p>
          </div>
          <div class="header-actions">
            <button @click="showPasswordChange = !showPasswordChange" class="admin-btn btn-outline">🔑 Change Password</button>
            <button @click="exportJSON" class="admin-btn btn-outline">📥 Export JSON</button>
            <label class="admin-btn btn-outline file-label">
              📤 Import JSON
              <input type="file" accept=".json" @change="handleFileImport" style="display: none" />
            </label>
            <button @click="handleLogout" class="admin-btn btn-danger">Log Out</button>
            <button @click="closeAdmin" class="admin-btn btn-primary">Exit Admin</button>
          </div>
        </header>

        <!-- PASSWORD CHANGE MODAL -->
        <div v-if="showPasswordChange" class="admin-card mb-24 password-change-card">
          <h2>🔐 Change Admin Password</h2>
          <div class="form-group mt-12">
            <label>New Password</label>
            <input v-model="newPasswordInput" type="password" placeholder="Enter new password" class="admin-input" />
          </div>
          <div class="form-group mt-12">
            <label>Confirm New Password</label>
            <input v-model="confirmPasswordInput" type="password" placeholder="Confirm new password" class="admin-input" />
          </div>
          <p v-if="passwordChangeError" class="error-msg mt-8">{{ passwordChangeError }}</p>
          <p v-if="passwordChangeSuccess" class="success-msg mt-8">✅ Password changed successfully!</p>
          <div class="mt-16 flex gap-12">
            <button @click="handleChangePassword" class="admin-btn btn-success">Update Password</button>
            <button @click="showPasswordChange = false" class="admin-btn btn-secondary">Cancel</button>
          </div>
        </div>

        <div class="admin-grid">

          <!-- CREATE / EDIT PROJECT FORM -->
          <div class="admin-card form-card">
            <h2>{{ editingProjectId ? "✏️ Edit Project" : "➕ Add New Project" }}</h2>
            <form @submit.prevent="handleSubmit" class="project-form">
              <div class="form-group">
                <label>Project Title *</label>
                <input v-model="title" type="text" placeholder="e.g. My AI Web App" required class="admin-input" />
              </div>

              <div class="form-group">
                <label>Live Website URL *</label>
                <input v-model="liveUrl" type="url" placeholder="https://my-app.vercel.app/" required class="admin-input" />
              </div>

              <div class="form-group">
                <label>GitHub Repository URL (Optional)</label>
                <input v-model="githubUrl" type="url" placeholder="https://github.com/username/repo" class="admin-input" />
              </div>

              <div class="form-group">
                <label>Short Description *</label>
                <input v-model="description" type="text" placeholder="e.g. Next-gen AI tools platform" required class="admin-input" />
              </div>

              <div class="form-group">
                <label>Detailed Description</label>
                <textarea v-model="detailedDescription" placeholder="Full breakdown of features and tech stack..." rows="3" class="admin-input"></textarea>
              </div>

              <div class="form-group">
                <label>Category</label>
                <select v-model="category" class="admin-input">
                  <option value="ecommerce">E-Commerce</option>
                  <option value="ai">AI & Cyber Tools</option>
                  <option value="education">Islamic / Education</option>
                </select>
              </div>

              <div class="form-group">
                <label>Technologies / Tags</label>
                <div class="tags-picker">
                  <span
                    v-for="t in availableTags"
                    :key="t.value"
                    :class="['tag-chip', selectedTags.includes(t.value) && 'tag-chip-active']"
                    @click="toggleTag(t.value)"
                  >
                    {{ t.label }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label>Project Thumbnail Image (Upload File or Paste Image URL)</label>
                <div class="image-upload-box">
                  <input type="file" accept="image/*" @change="handleImageUpload" class="admin-input" />
                  <input v-model="thumbnail" type="text" placeholder="Or paste image URL (https://...)" class="admin-input mt-8" />
                </div>
                <div v-if="thumbnail" class="image-preview">
                  <p>Image Preview:</p>
                  <img :src="thumbnail" alt="Preview" />
                </div>
              </div>

              <div class="flex gap-12 mt-12">
                <button type="submit" class="admin-btn btn-success btn-large">
                  {{ editingProjectId ? "💾 Update Project" : "🚀 Save & Publish Project" }}
                </button>
                <button v-if="editingProjectId" type="button" @click="cancelEditing" class="admin-btn btn-secondary">
                  Cancel Edit
                </button>
              </div>
            </form>
          </div>

          <!-- PROJECT LIST MANAGER -->
          <div class="admin-card list-card">
            <h2>📁 Portfolio Projects ({{ allProjects.length }})</h2>
            <p class="text-sm text-muted">Edit or delete any project below:</p>
            <div class="projects-table">
              <div v-for="proj in allProjects" :key="proj.id" class="table-row">
                <img :src="proj.thumbnail" :alt="proj.title" class="row-thumb" />
                <div class="row-info">
                  <h3>{{ proj.title }} <span v-if="proj.isCustom" class="badge-custom">Custom</span></h3>
                  <p>{{ proj.description }}</p>
                  <a :href="proj.liveUrl" target="_blank" rel="noopener noreferrer" class="row-link">{{ proj.liveUrl }}</a>
                </div>
                <div class="row-actions">
                  <button @click="startEditing(proj)" class="admin-btn btn-outline btn-sm">Edit</button>
                  <button @click="handleDelete(proj)" class="admin-btn btn-danger btn-sm">Delete</button>
                </div>
              </div>
            </div>
            <div class="reset-box">
              <button @click="resetToDefault" class="admin-btn btn-warning btn-sm">Restore Original 4 Projects</button>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
.admin-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999999;
  background: rgba(10, 15, 25, 0.96);
  backdrop-filter: blur(20px);
  color: #e2e8f0;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  font-family: system-ui, -apple-system, sans-serif;
  padding: 40px 20px;
  box-sizing: border-box;
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 60px;
}

.admin-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
}

.password-change-card {
  border-color: #0284c7;
}

.auth-card {
  max-width: 460px;
  margin: 60px auto;

  .auth-header {
    text-align: center;
    margin-bottom: 24px;

    h2 {
      font-size: 1.6rem;
      color: #38bdf8;
      margin-bottom: 6px;
    }

    p {
      color: #94a3b8;
      font-size: 0.9rem;
    }
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  .admin-input {
    padding-right: 90px;
  }

  .toggle-pwd-btn {
    position: absolute;
    right: 8px;
    background: transparent;
    border: none;
    color: #38bdf8;
    font-size: 0.8rem;
    cursor: pointer;
    padding: 6px 10px;
  }
}

.admin-input {
  width: 100%;
  padding: 12px 16px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #fff;
  font-size: 0.95rem;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #38bdf8;
  }
}

.admin-btn {
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #0284c7;
  color: #fff;

  &:hover {
    background: #0369a1;
  }
}

.btn-secondary {
  background: #334155;
  color: #cbd5e1;

  &:hover {
    background: #475569;
  }
}

.btn-outline {
  background: transparent;
  border: 1px solid #475569;
  color: #e2e8f0;

  &:hover {
    background: #334155;
  }
}

.btn-success {
  background: #10b981;
  color: #fff;

  &:hover {
    background: #059669;
  }
}

.btn-danger {
  background: #ef4444;
  color: #fff;

  &:hover {
    background: #dc2626;
  }
}

.btn-warning {
  background: #f59e0b;
  color: #fff;

  &:hover {
    background: #d97706;
  }
}

.btn-large {
  width: 100%;
  padding: 14px;
  font-size: 1rem;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
}

.error-msg {
  color: #f87171;
  font-size: 0.85rem;
  background: rgba(239, 68, 68, 0.1);
  padding: 10px;
  border-radius: 6px;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.success-msg {
  color: #34d399;
  font-size: 0.85rem;
  background: rgba(52, 211, 153, 0.1);
  padding: 10px;
  border-radius: 6px;
  border: 1px solid rgba(52, 211, 153, 0.3);
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 16px;

  h1 {
    font-size: 1.8rem;
    color: #38bdf8;
    margin-bottom: 4px;
  }

  p {
    color: #94a3b8;
  }
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  .file-label {
    display: inline-block;
  }
}

.admin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.project-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.85rem;
    color: #cbd5e1;
    font-weight: 500;
  }
}

.tags-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-chip {
  padding: 6px 12px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  color: #94a3b8;

  &-active {
    background: #0284c7;
    border-color: #38bdf8;
    color: #fff;
  }
}

.image-preview {
  margin-top: 12px;

  img {
    width: 100%;
    max-height: 180px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #334155;
  }
}

.projects-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  max-height: 600px;
  overflow-y: auto;
}

.table-row {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #0f172a;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #1e293b;

  @media (max-width: 540px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .row-thumb {
      width: 100%;
      height: 120px;
    }

    .row-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
}

.row-thumb {
  width: 80px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}

.row-info {
  flex: 1;

  h3 {
    font-size: 0.95rem;
    color: #f1f5f9;
  }

  p {
    font-size: 0.8rem;
    color: #94a3b8;
  }

  .row-link {
    font-size: 0.75rem;
    color: #38bdf8;
    text-decoration: none;
  }
}

.row-actions {
  display: flex;
  gap: 8px;
}

.badge-custom {
  font-size: 0.7rem;
  background: #0284c7;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
}

.flex { display: flex; }
.gap-12 { gap: 12px; }
.mt-8 { margin-top: 8px; }
.mt-12 { margin-top: 12px; }
.mt-16 { margin-top: 16px; }
.mb-24 { margin-bottom: 24px; }
.text-sm { font-size: 0.85rem; }
.text-muted { color: #94a3b8; }

.reset-box {
  margin-top: 20px;
  text-align: right;
}
</style>
