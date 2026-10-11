import React from 'react';
import Svg, { Path, Circle, Rect, G, Defs, ClipPath } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

export interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const GalleryWideLineDuotoneIcon: React.FC<IconProps> = ({
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
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      <G fill="none" stroke={color} strokeWidth="1.5"><Rect width="18" height="14" x="3" y="5" rx="3"/><Circle cx="8.5" cy="9.5" r="1.5" fill={color}/><Path strokeLinecap="round" strokeLinejoin="round" d="M3 16l4.5-4.5a1.5 1.5 0 012.1 0L14 16l2.5-2.5a1.5 1.5 0 012.1 0L21 16"/></G>
    </Svg>
  );
};

export default GalleryWideLineDuotoneIcon;
