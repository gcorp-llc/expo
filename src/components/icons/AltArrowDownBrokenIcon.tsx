import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

export interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const AltArrowDownBrokenIcon: React.FC<IconProps> = ({
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
      <Path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9L12 15L10.25 13.5M5 9L7.33333 11"/>
    </Svg>
  );
};

export default AltArrowDownBrokenIcon;
