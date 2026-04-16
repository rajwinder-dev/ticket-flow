import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "no-restricted-syntax": [
        "warn",
        {
          selector: "Literal[value=/^#(?:[0-9a-fA-F]{3}){1,2}$/]",
          message: "Avoid hardcoded hex colors. Use CSS variables or Tailwind classes.",
        },
        {
          selector: "Literal[value=/^rgb|^hsl/i]",
          message: "Avoid hardcoded color names. Use CSS variables or Tailwind classes.",
        },
      ],
      ...reactHooks.configs.recommended.rules,
    },
  },
);
