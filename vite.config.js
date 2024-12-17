import { defineConfig } from "vite";

export default defineConfig({
    base: "",
    plugins: [
    ],
    build: {
        target: "esnext",
    },
    define: {
        "import.meta.env.VERSION": JSON.stringify(
            process.env.npm_package_version
        ),
    },
    server: {
        // Expose the server to the network allowing access from ip address
        host: true,
        open: true,
    },
});
