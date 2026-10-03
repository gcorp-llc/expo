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

export const Iconify = React.memo(({ icon, size, color, style, width, height }: IconifyProps) => {
  // Extract icon name from "solar:name" or just "name"
  const name = (icon.startsWith('solar:') ? icon.replace('solar:', '') : icon) as IconName;

  const iconData = iconsData[name];

  if (!iconData) {
    if (__DEV__) {
      console.warn(`[Iconify] icon "${icon}" (parsed as "${name}") not found in icons-data.ts`);
    }
    return null;
  }

  // Use size if provided, otherwise use width or height, defaulting to 24
  const finalWidth = size ?? width ?? 24;
  const finalHeight = size ?? height ?? 24;

  const { body, attributes } = iconData;

  // Build SVG XML
  // We use the attributes from iconData (like viewBox) and override width and height.
  // We don't set fill/stroke on the <svg> tag string because it doesn't always
  // propagate correctly to children using currentColor in react-native-svg.
  // Instead, we pass the 'color' prop to SvgXml which handles currentColor correctly.

  const xmlAttributes = {
    ...attributes,
    width: finalWidth.toString(),
    height: finalHeight.toString(),
  };

  const attrString = Object.entries(xmlAttributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  const finalXml = `<svg ${attrString}>${body}</svg>`;

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
