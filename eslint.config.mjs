import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

export default [
  {
    ignores: [".next/**", "node_modules/**", "public/cache/**", "public/blogscache/**", "pages/blogscache/**"],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",
      "@next/next/no-html-link-for-pages": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/immutability": "off",
      "react-hooks/globals": "off",
      "react-hooks/refs": "off",
      "react-hooks/incompatible-library": "off",
      "react-hooks/purity": "off",
      "react-hooks/static-components": "off",
      "react-hooks/rules-of-hooks": "warn",
    },
  },
];
