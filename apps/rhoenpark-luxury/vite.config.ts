import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

function tagungHtmlFallback(): Plugin {
  return {
    name: "tagung-html-fallback",
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (!request.url) return next();

        const url = new URL(request.url, "http://localhost");
        const isTagungRoute =
          url.pathname === "/tagung" ||
          (url.pathname.startsWith("/tagung/") && url.pathname !== "/tagung/index.html");

        if (isTagungRoute) request.url = `/tagung/index.html${url.search}`;
        return next();
      });
    },
  };
}

export default defineConfig({
  plugins: [tagungHtmlFallback(), react()],
  resolve: {
    alias: [
      {
        find: /^@franco\/booking-ui\/styles\.css$/,
        replacement: fileURLToPath(
          new URL("../../packages/booking-ui/src/styles.css", import.meta.url),
        ),
      },
      {
        find: /^@franco\/booking-ui$/,
        replacement: fileURLToPath(
          new URL("../../packages/booking-ui/src/index.ts", import.meta.url),
        ),
      },
    ],
  },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        tagung: fileURLToPath(new URL("./tagung/index.html", import.meta.url)),
      },
    },
  },
});
