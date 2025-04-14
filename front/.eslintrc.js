module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      alias: {
        map: [["@", "./src"]],
      },
      typescript: {},
    },
  },
  plugins: ["@typescript-eslint", "react", "import", "css-modules"],
  extends: [
    "airbnb-base",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:css-modules/recommended",
    "plugin:import/errors",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "prettier",
  ],
  rules: {
    indent: "off",
    "no-nested-ternary": "off",
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "error",
    "react/no-unknown-property": ["error", { ignore: ["css"] }],
    "react/display-name": "off",
    "import/prefer-default-export": "off",
    "import/extensions": "off",
    "react/react-in-jsx-scope": "off",
  },
};
