import { promises as fs } from 'fs';
import path from 'path';
import { locate } from '@iconify/json';
import { getIconData } from '@iconify/utils/lib/icon-set/get-icon';
import { iconToSVG } from '@iconify/utils/lib/svg/build';

async function scanForIcons(directory: string): Promise<string[]> {
  const iconPattern = /solar:([a-z0-9-]+)/g;
  const foundIcons = new Set<string>();

  async function walk(dir: string) {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        if (file !== 'node_modules' && file !== '.git' && file !== '.expo') {
          await walk(fullPath);
        }
      } else if (file.match(/\.(tsx|ts|js|jsx)$/)) {
        if (file === 'Iconify.tsx' || file === 'icons-data.ts') continue;
        const content = await fs.readFile(fullPath, 'utf8');
        let match;
        while ((match = iconPattern.exec(content)) !== null) {
          foundIcons.add(match[1]);
        }
      }
    }
  }

  await walk(directory);
  return Array.from(foundIcons).sort();
}

async function generateIcons() {
  const srcDir = path.join(__dirname, '../src');
  const usedIcons = await scanForIcons(srcDir);
  console.log(`\n🔍 Scanning codebase for icons...`);
  console.log(`✅ Found ${usedIcons.length} unique solar icons in use.`);

  const filename = locate('solar');
  if (!filename) {
      console.error('❌ Error: @iconify-json/solar package not found. Please run "npm install -D @iconify-json/solar"');
      process.exit(1);
  }

  const data = JSON.parse(await fs.readFile(filename, 'utf8'));
  const result: Record<string, { body: string; attributes: Record<string, string> }> = {};
  const missingIcons: string[] = [];

  for (const name of usedIcons) {
    const iconData = getIconData(data, name);
    if (!iconData) {
      missingIcons.push(name);
      continue;
    }

    const renderData = iconToSVG(iconData);
    result[name] = {
      body: renderData.body,
      attributes: renderData.attributes,
    };
  }

  if (missingIcons.length > 0) {
    console.log(`\n⚠️  WARNING: The following ${missingIcons.length} icons were NOT found in the solar set:`);
    missingIcons.forEach(icon => console.log(`   - solar:${icon}`));
    console.log(`\nPlease check the icon names for typos or find suitable replacements at https://icon-sets.iconify.design/solar/\n`);
  }

  const output = `// Auto-generated via scripts/generate-icons.ts — do not edit manually
export const iconsData = ${JSON.stringify(result, null, 2)} as const;

export type IconName = keyof typeof iconsData;

export type IconData = {
  body: string;
  attributes: {
    viewBox: string;
    width: string;
    height: string;
    [key: string]: string;
  };
};
`;

  const outputPath = path.join(__dirname, '../src/components/ui/icons-data.ts');
  await fs.writeFile(outputPath, output, 'utf8');
  console.log(`✨ Successfully generated icons-data.ts with ${Object.keys(result).length} icons.`);
}

generateIcons().catch(console.error);
