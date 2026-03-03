import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ЗАМЕНИ "school-schedule" на ТОЧНОЕ имя твоего GitHub-репозитория
export default defineConfig({
  plugins: [react()],
  base: "/SHEDULE1/",
});
