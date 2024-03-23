/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['sznm/react', 'plugin:react/jsx-runtime'],
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "": "never",
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never"
      }
   ]
  }
};
