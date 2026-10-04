const fs = require('fs');
const path = require('path');
const solarData = JSON.parse(fs.readFileSync(path.join(__dirname, '../node_modules/@iconify-json/solar/icons.json'), 'utf8'));
const { getIconData } = require(path.join(__dirname, '../node_modules/@iconify/utils/lib/icon-set/get-icon'));
const { iconToSVG } = require(path.join(__dirname, '../node_modules/@iconify/utils/lib/svg/build'));

const iconPattern = /solar:([a-z0-9-]+)/g;
const foundIcons = new Set();

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.expo' && file !== 'dist' && file !== 'icons') {
        walk(fullPath);
      }
    } else if (file.match(/\.(tsx|ts|js|jsx)$/)) {
      if (file === 'Iconify.tsx' || file === 'icons-data.ts' || file === 'generate-icons.ts') continue;
      const content = fs.readFileSync(fullPath, 'utf8');
      let match;
      while ((match = iconPattern.exec(content)) !== null) {
        foundIcons.add(match[1]);
      }
    }
  }
}

walk(path.join(__dirname, '../src'));

const extraMappings = [
  'home-bold',
  'plain-bold',
  'code-bold',
  'alt-arrow-right-bold',
  'heart-bold',
  'star-bold',
  'add-square-bold',
  'stop-broken',
  'check-square-broken'
];

extraMappings.forEach(i => foundIcons.add(i));

const iconsDir = path.join(__dirname, '../src/components/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

function toPascalCase(str) {
  return str
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') + 'Icon';
}

function parseSvgBodyToJsx(body) {
  return body
    .replace(/fill-rule=/g, 'fillRule=')
    .replace(/clip-rule=/g, 'clipRule=')
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/stroke-linecap=/g, 'strokeLinecap=')
    .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/stroke-miterlimit=/g, 'strokeMiterlimit=')
    .replace(/stroke-dasharray=/g, 'strokeDasharray=')
    .replace(/stroke-dashoffset=/g, 'strokeDashoffset=')
    .replace(/fill-opacity=/g, 'fillOpacity=')
    .replace(/stroke-opacity=/g, 'strokeOpacity=')
    .replace(/="currentColor"/g, '={color}')
    .replace(/<path/g, '<Path')
    .replace(/<\/path>/g, '</Path>')
    .replace(/<circle/g, '<Circle')
    .replace(/<\/circle>/g, '</Circle>')
    .replace(/<rect/g, '<Rect')
    .replace(/<\/rect>/g, '</Rect>')
    .replace(/<g/g, '<G')
    .replace(/<\/g>/g, '</G>')
    .replace(/<use/g, '<Use')
    .replace(/<\/use>/g, '</Use>')
    .replace(/<defs/g, '<Defs')
    .replace(/<\/defs>/g, '</Defs>')
    .replace(/<clipPath/g, '<ClipPath')
    .replace(/<\/clipPath>/g, '</ClipPath>');
}

const exportedIcons = [];

for (const name of Array.from(foundIcons).sort()) {
  let lookupName = name;
  if (name === 'square-broken') lookupName = 'stop-broken';

  let iconData = getIconData(solarData, lookupName);
  let svgBody = '';
  let viewBox = '0 0 24 24';

  if (iconData) {
    const render = iconToSVG(iconData);
    svgBody = render.body;
    viewBox = render.attributes.viewBox || '0 0 24 24';
  } else if (name === 'play-broken') {
    svgBody = '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.435 11.233L9.673 6.643c-1.3-.77-3.004.14-3.004 1.62v9.474c0 1.48 1.704 2.39 3.004 1.62l7.762-4.59c1.246-.736 1.246-2.524 0-3.26l-.234-.138"/>';
    viewBox = '0 0 24 24';
  } else {
    console.warn('Skipping missing icon:', name);
    continue;
  }

  const compName = toPascalCase(name);
  const fileName = `${compName}.tsx`;
  const filePath = path.join(iconsDir, fileName);

  const jsxBody = parseSvgBodyToJsx(svgBody);

  const hasPath = jsxBody.includes('<Path');
  const hasCircle = jsxBody.includes('<Circle');
  const hasRect = jsxBody.includes('<Rect');
  const hasG = jsxBody.includes('<G');
  const hasDefs = jsxBody.includes('<Defs');
  const hasClipPath = jsxBody.includes('<ClipPath');

  const svgImports = ['Svg'];
  if (hasPath) svgImports.push('Path');
  if (hasCircle) svgImports.push('Circle');
  if (hasRect) svgImports.push('Rect');
  if (hasG) svgImports.push('G');
  if (hasDefs) svgImports.push('Defs');
  if (hasClipPath) svgImports.push('ClipPath');

  const content = `import React from 'react';
import Svg, { ${svgImports.filter(i => i !== 'Svg').join(', ')} } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

export interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const ${compName}: React.FC<IconProps> = ({
  size = 24,
  width,
  height,
  color = 'currentColor',
  style,
}) => {
  const w = size ?? width ?? 24;
  const h = size ?? height ?? 24;

  return (
    <Svg
      width={w}
      height={h}
      viewBox="${viewBox}"
      fill="none"
      style={style}
    >
      ${jsxBody}
    </Svg>
  );
};

export default ${compName};
`;

  fs.writeFileSync(filePath, content, 'utf8');
  exportedIcons.push({ compName, fileName: compName, iconName: name });
}

// Write index.ts
let indexContent = exportedIcons.map(item => `export { ${item.compName} } from './${item.compName}';`).join('\n') + '\n\n';

indexContent += `import React from 'react';
import { IconProps } from './AddCircleBoldIcon';
${exportedIcons.map(item => `import { ${item.compName} } from './${item.compName}';`).join('\n')}

export const ICON_MAP: Record<string, React.FC<IconProps>> = {
${exportedIcons.map(item => `  '${item.iconName}': ${item.compName},`).join('\n')}
};

export interface DynamicIconProps extends IconProps {
  name: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  const cleanName = name.startsWith('solar:') ? name.replace('solar:', '') : name;
  const IconComponent = ICON_MAP[cleanName];
  if (!IconComponent) {
    if (__DEV__) {
      console.warn(\`[Icons] Icon "\${name}" (parsed as "\${cleanName}") not found in local icons.\`);
    }
    return null;
  }
  return <IconComponent {...props} />;
};

export { DynamicIcon as Iconify };
`;

fs.writeFileSync(path.join(iconsDir, 'index.ts'), indexContent, 'utf8');
console.log('Successfully regenerated', exportedIcons.length, 'icon components in src/components/icons');
