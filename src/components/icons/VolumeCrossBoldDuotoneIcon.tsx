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

export const VolumeCrossBoldDuotoneIcon: React.FC<IconProps> = ({
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
      <G fill="none"><Path fill={color} fillOpacity="0.2" d="M11 5L6 9H3a1 1 0 00-1 1v4a1 1 0 001 1h3l5 4V5z"/><Path stroke={color} strokeLinecap="round" strokeWidth="1.5" d="M15 8.5l6 6M21 8.5l-6 6M11 5L6 9H3a1 1 0 00-1 1v4a1 1 0 001 1h3l5 4V5z"/></G>
    </Svg>
  );
};

export default VolumeCrossBoldDuotoneIcon;
