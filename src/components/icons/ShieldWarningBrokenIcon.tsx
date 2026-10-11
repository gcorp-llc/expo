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

export const ShieldWarningBrokenIcon: React.FC<IconProps> = ({
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
      <G fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.5"><Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><Path d="M12 8v4"/><Circle cx="12" cy="15" r="1" fill={color}/></G>
    </Svg>
  );
};

export default ShieldWarningBrokenIcon;
