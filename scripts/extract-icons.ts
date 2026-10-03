import { promises as fs } from 'fs';
import path from 'path';
import { locate } from '@iconify/json';
import { getIconData } from '@iconify/utils/lib/icon-set/get-icon';
import { iconToSVG } from '@iconify/utils/lib/svg/build';

// Mapping for icons that are named differently in Solar set
// but are used in the codebase with these names.
const NAME_MAPPING: Record<string, string> = {
  "heart-crack-bold": "heart-broken-bold",
  "megaphone-bold": "speaker-bold",
  "menu-dots-vertical-bold": "menu-dots-bold",
  "menu-dots-vertical-broken": "menu-dots-broken",
  "paper-plane-bold": "plain-bold",
  "paper-plane-broken": "plain-broken",
  "send-broken": "plain-broken"
};

async function scanForIcons(directory: string): Promise<string[]> {
  const iconPattern = /solar:([a-z0-9-]+)/g;
  const foundIcons = new Set<string>();

  async function walk(dir: string) {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = await fs.stat(fullPath);
      if (stat.isDirectory()) {
        if (file !== 'node_modules' && file !== '.git') {
          await walk(fullPath);
        }
      } else if (file.match(/\.(tsx|ts|js|jsx)$/)) {
        if (file === 'Iconify.tsx') continue; // Skip the component itself
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

async function extractSolarIcons() {
  const srcDir = path.join(__dirname, '../src');
  const usedIcons = await scanForIcons(srcDir);
  console.log(`Found ${usedIcons.length} icons used in ${srcDir}`);

  const filename = locate('solar');
  const data = JSON.parse(await fs.readFile(filename, 'utf8'));

  const result: Record<string, { body: string; attributes: Record<string, string> }> = {};

  // We need to extract both the original names and the mapped names
  const iconsToExtract = new Set(usedIcons);
  for (const name of usedIcons) {
      if (NAME_MAPPING[name]) {
          iconsToExtract.add(NAME_MAPPING[name]);
      }
  }

  for (const name of iconsToExtract) {
    const iconData = getIconData(data, name);
    if (!iconData) {
      if (!Object.values(NAME_MAPPING).includes(name)) {
         console.warn(`Icon "${name}" not found in solar icon set`);
      }
      continue;
    }

    const renderData = iconToSVG(iconData);
    result[name] = {
      body: renderData.body,
      attributes: renderData.attributes,
    };
  }

  // Ensure the original names used in code point to the extracted data
  for (const [original, mapped] of Object.entries(NAME_MAPPING)) {
      if (usedIcons.includes(original) && result[mapped]) {
          result[original] = result[mapped];
      }
  }

  const output = `// Auto-generated — do not edit manually
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
  console.log(`Extracted ${Object.keys(result).length} icons (including aliases) to ${outputPath}`);
}

extractSolarIcons().catch(console.error);
