import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Repo scripts / generators (not shipped with app):
    "convert_2025_roster.js",
    "scripts/**",
  ]),
  {
    rules: {
      // This rule is overly strict for common patterns like initializing state
      // from localStorage within a mount effect.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
