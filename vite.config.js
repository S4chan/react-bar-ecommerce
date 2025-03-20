import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
<<<<<<< HEAD
  base: process.env.NODE_ENV === "production" ? "/react-bar-ecommerce/" : "/",
=======
>>>>>>> dd9753682eb80d3a10a5b9dcd250b0f744ce7039
  plugins: [react()],
});
