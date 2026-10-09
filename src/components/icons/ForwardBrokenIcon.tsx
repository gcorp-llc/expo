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

export const ForwardBrokenIcon: React.FC<IconProps> = ({
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
      <Path fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.5 17L19.5 12L14.5 7M19.5 12L13 12M9.5 12C7.83333 12 4.5 13 4.5 17"/>
    </Svg>
  );
};

export default ForwardBrokenIcon;
