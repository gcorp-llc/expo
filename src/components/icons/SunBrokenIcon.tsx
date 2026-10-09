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

export const SunBrokenIcon: React.FC<IconProps> = ({
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
      <G fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.5"><Path d="M12 2V3"/><Path d="M12 21V22"/><Path d="M22 12L21 12"/><Path d="M3 12L2 12"/><Path d="M19.0708 4.92969L18.678 5.32252"/><Path d="M5.32178 18.6777L4.92894 19.0706"/><Path d="M19.0708 19.0703L18.678 18.6775"/><Path d="M5.32178 5.32227L4.92894 4.92943"/><Path d="M6.34141 10C6.12031 10.6256 6 11.2987 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C11.2987 6 10.6256 6.12031 10 6.34141"/></G>
    </Svg>
  );
};

export default SunBrokenIcon;
