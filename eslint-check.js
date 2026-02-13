const { ESLint } = require("eslint");

(async function main() {
  // 1. Create ESLint instance
  const eslint = new ESLint();

  // 2. Lint files
  const results = await eslint.lintFiles(["src/**/*.ts"]);

  // 3. Format output
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(results);

  if (resultText) {
    console.log(resultText); // Print warnings/errors
  } else {
    console.log("✅ All functions are below the complexity threshold. No issues found.");
  }
})();
