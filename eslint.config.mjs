import { defineConfig, globalIgnores } from "eslint/config";
import pluginNext from "@next/eslint-plugin-next";
import pluginReactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
    globalIgnores(["node_modules", ".next", "out", "public", "playground", ".github", ".agents"]),
    ...tseslint.configs.recommended,
    {
        plugins: {
            "react-hooks": pluginReactHooks,
            "@next/next": pluginNext,
        },
        rules: {
            ...pluginReactHooks.configs.recommended.rules,
            ...pluginNext.configs.recommended.rules,
            ...pluginNext.configs["core-web-vitals"].rules,
        },
    },
    prettier,
    {
        settings: {
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
    },
]);
