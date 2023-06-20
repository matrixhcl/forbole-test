import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/unit-tests/setup.ts",
    exclude: ["./src/e2e-tests/**", "./node_modules/**"],
  },
});
