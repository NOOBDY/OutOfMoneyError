import globals from "globals";
import jsPlugin from "@eslint/js";
import solidPlugin from "eslint-plugin-solid";
import prettierConfig from "eslint-config-prettier";
import * as tsParser from "@typescript-eslint/parser";

export default [
    jsPlugin.configs.recommended,
    prettierConfig,
    {
        files: ["packages/frontend/**/*.{ts,tsx}"],
        ...solidPlugin.configs["flat/typescript"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "packages/frontend/tsconfig.json"
            },
            globals: {
                ...globals.node,
                ...globals.browser
            }
        }
    },
    {
        files: ["packages/contracts/**/*.ts"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "packages/contracts/tsconfig.json"
            },
            globals: {
                ...globals.node,
                ...globals.mocha
            }
        }
    },
    {
        ignores: [
            "packages/frontend/.vinxi/",
            "packages/frontend/dist/",
            "packages/frontend/.wrangler/",
            "packages/contracts/artifacts/",
            "packages/contracts/cache/"
        ]
    }
];
