import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "AI Web Memory",
  version: "1.0.0",

  permissions: [
    "storage",
    "tabs",
    "activeTab",
    "scripting"
  ],

  host_permissions: [
    "<all_urls>"
  ],

  action: {
    default_popup: "index.html"
  },

  background: {
    service_worker: "src/background/background.ts",
    type: "module"
  },

  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content/contentScript.ts"]
    }
  ]
});