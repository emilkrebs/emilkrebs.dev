import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
    globalIgnores(["node_modules", ".next", "out", "public", "playground", ".github", ".agents"]),
    ...nextVitals,
    prettier,
    {
        settings: {
            react: {
                version: "detect",
            },

            next: {
                rootDir: "./src",
            },
        },

        rules: {
            indent: ["error", 4],
            "linebreak-style": "off",
            quotes: ["error", "double"],
            semi: ["error", "always"],
        },
    }]);
