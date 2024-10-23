module.exports = {
    root: true,
    settings: {
        react: {
            version: "detect", // Automatically detects the React version
        },
        "import/resolver": {
            typescript: {}, // This ensures ESLint resolves TypeScript imports
        },
    },
    env: { browser: true, es2020: true },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "prettier",
        "plugin:prettier/recommended",
        "plugin:import/recommended",
        "plugin:react/jsx-runtime",
        // 'plugin:react-hooks/recommended',
    ],
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    parser: "@typescript-eslint/parser",
    plugins: ["react", "react-refresh", "autofix"],
    rules: {
        "autofix/no-debugger": "error",
        "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
        "@typescript-eslint/no-explicit-any": "off",
    },
};
