import React from 'react';
import Svg, { Path, G } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

export interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const CheckReadBrokenIcon: React.FC<IconProps> = ({
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
      <G fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.5"><Path d="M4 12.9004L7.14286 16.5004"/><Path d="M7.14282 16.5L9.10711 14.25"/><Path d="M11.0715 12L15.0001 7.5"/><Path strokeLinejoin="round" d="M20.0002 7.5625L15.7144 12.0625M11.0002 16L11.4286 16.5625L13.5715 14.3125"/></G>
    </Svg>
  );
};

export default CheckReadBrokenIcon;
