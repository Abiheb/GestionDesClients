import tsPkg from 'typescript';
const ts = tsPkg;
import * as fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ES module workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Scan a single file and return the number of imported classes/services
function getCoupling(fileName: string) {
  const source = ts.createSourceFile(
    fileName,
    fs.readFileSync(fileName, 'utf-8'),
    ts.ScriptTarget.ESNext,
    true,
  );

  const imports: Set<string> = new Set();

  ts.forEachChild(source, (node) => {
    if (ts.isImportDeclaration(node)) {
      const bindings = node.importClause?.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) {
        bindings.elements.forEach((el) => imports.add(el.name.text));
      }
    }
  });

  return imports.size;
}

// Recursively scan a folder
function checkCoupling(folderPath: string) {
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const fullPath = join(folderPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      checkCoupling(fullPath);
    } else if (file.endsWith('.ts')) {
      const couplingCount = getCoupling(fullPath);
      const className = file
        .replace('.component.ts', '')
        .replace('.service.ts', '');
      let level = 'LOW';
      if (couplingCount >= 5) level = 'HIGH';
      else if (couplingCount >= 3) level = 'MEDIUM';
      console.log(`${className} → Coupling: ${couplingCount} → ${level}`);
    }
  });
}

// Run on your features folder
const srcFolder = join(__dirname, '../src/app/features');
checkCoupling(srcFolder);