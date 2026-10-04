import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { iconsData, IconName } from './icons-data';

interface IconifyProps {
  icon: string;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
}

const xmlCache = new Map<string, string>();

function getXml(name: IconName, width: number, height: number): string | null {
  const cacheKey = `${name}:${width}:${height}`;
  const cached = xmlCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const iconData = (iconsData as Record<string, any>)[name];
  if (!iconData) {
    return null;
  }

  const { body, attributes } = iconData;

  const xmlAttributes = {
    ...attributes,
    width: width.toString(),
    height: height.toString(),
  };

  const attrString = Object.entries(xmlAttributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  const xml = `<svg ${attrString}>${body}</svg>`;
  xmlCache.set(cacheKey, xml);
  return xml;
}

export const Iconify = React.memo(({ icon, size, color, style, width, height }: IconifyProps) => {
  // Extract icon name from "solar:name" or just "name"
  const name = (icon.startsWith('solar:') ? icon.replace('solar:', '') : icon) as IconName;

  // Use size if provided, otherwise use width or height, defaulting to 24
  const finalWidth = size ?? width ?? 24;
  const finalHeight = size ?? height ?? 24;

  const finalXml = getXml(name, finalWidth, finalHeight);

  if (!finalXml) {
    if (__DEV__) {
      console.warn(`[Iconify] icon "${icon}" (parsed as "${name}") not found in icons-data.ts`);
    }
    return null;
  }

  return (
    <SvgXml
      xml={finalXml}
      width={finalWidth}
      height={finalHeight}
      style={style}
      color={color} // This is crucial for currentColor to work in react-native-svg
    />
  );
});

Iconify.displayName = 'Iconify';
