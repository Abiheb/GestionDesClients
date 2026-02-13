import pkg from 'typescript';
import * as fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const {
  createSourceFile,
  forEachChild,
  isClassDeclaration,
  isMethodDeclaration,
  isPropertyDeclaration,
  ScriptTarget
} = pkg;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ClassInfo {
  name: string;
  methods: string[];
  properties: string[];
}

function getClasses(fileName: string): ClassInfo[] {
  const source = createSourceFile(
    fileName,
    fs.readFileSync(fileName, 'utf8'),
    ScriptTarget.Latest,
    true
  );

  const classes: ClassInfo[] = [];

  forEachChild(source, (node: any) => {
    if (isClassDeclaration(node) && node.name) {
      const cls: ClassInfo = {
        name: node.name.text,
        methods: [],
        properties: []
      };

      node.members.forEach((member: any) => {
        if (isMethodDeclaration(member) && member.name) {
          cls.methods.push(member.name.getText());
        } 
        else if (isPropertyDeclaration(member) && member.name) {
          cls.properties.push(member.name.getText());
        }
      });

      classes.push(cls);
    }
  });

  return classes;
}

function calculateCohesion(cls: ClassInfo): number {
  const total = cls.methods.length + cls.properties.length;
  if (total === 0) return 0;
  return cls.methods.length / total;
}

function interpretScore(score: number): string {
  if (score >= 0.75) return "VERY HIGH";
  if (score >= 0.5) return "GOOD";
  if (score >= 0.3) return "MEDIUM";
  return "LOW";
}

function checkCohesion(folderPath: string) {
  const files = fs.readdirSync(folderPath);

  files.forEach(file => {
    const fullPath = join(folderPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      checkCohesion(fullPath);
    } 
    else if (file.endsWith('.ts')) {
      const classes = getClasses(fullPath);

      classes.forEach(cls => {
        const score = calculateCohesion(cls);
        const interpretation = interpretScore(score);

        console.log(`\nClass: ${cls.name}`);
        console.log(`Methods: ${cls.methods.length}`);
        console.log(`Properties: ${cls.properties.length}`);
        console.log(`Cohesion Score: ${score.toFixed(2)} → ${interpretation}`);
      });
    }
  });
}

// Adjust this path if needed
const srcFolder = join(__dirname, '../src/app/features');
checkCohesion(srcFolder);