import { defineConfig, loadEnv  } from "vite";
import vituum from 'vituum';
import tailwindcss from 'tailwindcss'


import nunjucks from '@vituum/vite-plugin-nunjucks'

// const headers = {
//     'Accept': 'application/vnd.github+json',
//     'Authorization': 'Bearer ',
//     'X-GitHub-Api-Version': '2022-11-28',
//     'User-Agent': 'curl'
// }
// const req = await fetch("https://api.github.com/repos/DanYellow/cours/collaborators", { headers });

// // console.log(await res.json());

// let json = await req.json();
// const res = []
// for (const element of json) {
//     const req = await fetch(`https://api.github.com/users/${element.login}`, { headers });
//     const collaboratorJson = await req.json();

//     res.push({
//         login: element.login,
//         name: collaboratorJson.name,
//         html_url: collaboratorJson.html_url,
//     })
// }

export default ({ mode }) => {
    // Load app-level env vars to node-level env vars.
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    return defineConfig({
        base: "./",
        // root: "./index.tmp.html",
        plugins: [
            // vituum(),
            vituum({
                pages: {
                    dir: "./src",
                    root: "./",
                    normalizeBasePath: true
                }
            }),
            nunjucks({
                // root: './', process.env.VITE_LIST_COLLABORATORS
                globals: {
                    LIST_COLLABORATORS: JSON.parse(process.env.VITE_LIST_COLLABORATORS),
                    VITE_FOO: process.env.FOO
                }
            })
        ],
        build: {
            target: "esnext",
            rollupOptions: {
                input: ['src/index.njk']
            }
        },
        define: {
            "import.meta.env.VERSION": JSON.stringify(
                process.env.npm_package_version
            ),
            // "import.meta.env.MEMBERS": res,
        },
        server: {
            // Expose the server to the network allowing access from ip address
            host: true,
            open: true,
        },
        test: {
            exclude: [
                "**/node_modules/**",
                "**/dist/**",
                "**/cypress/**",
                "**/.{idea,git,cache,output,temp}/**",
                "**/e2e/**",
            ],
            environment: 'happy-dom',
            css: false,
        },
    });
}


