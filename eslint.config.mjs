import js from "@eslint/js";
import globals from "globals";
import astro from "eslint-plugin-astro";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist/**", "node_modules/**", ".astro/**", "tailwind.config.mjs"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,cjs,mjs,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        React: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      semi: ["error", "always"],
      quotes: ["error", "double", { allowTemplateLiterals: true }],
      "@typescript-eslint/no-explicit-any": "off",
      reportUnusedDisableDirectives: "off",
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  ...astro.configs["flat/recommended"],
];
