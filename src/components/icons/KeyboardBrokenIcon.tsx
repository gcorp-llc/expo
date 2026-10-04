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

export const KeyboardBrokenIcon: React.FC<IconProps> = ({
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
      <G fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.5"><Path d="M16 5C18.8284 5 20.2426 5 21.1213 5.87868C22 6.75736 22 8.17157 22 11V13C22 15.8284 22 17.2426 21.1213 18.1213C20.2426 19 18.8284 19 16 19H8C5.17157 19 3.75736 19 2.87868 18.1213C2 17.2426 2 15.8284 2 13V11C2 8.17157 2 6.75736 2.87868 5.87868C3.75736 5 5.17157 5 8 5H12"/><Path d="M7 16H17"/><Path strokeLinejoin="round" d="M6 9H6.0001"/><Path strokeLinejoin="round" d="M9 9H9.0001"/><Path strokeLinejoin="round" d="M12 9H12.0001"/><Path strokeLinejoin="round" d="M15 9H15.0001"/><Path strokeLinejoin="round" d="M18 9H18.0001"/><Path strokeLinejoin="round" d="M18 12H18.0001"/><Path strokeLinejoin="round" d="M15 12H15.0001"/><Path strokeLinejoin="round" d="M12 12H12.0001"/><Path strokeLinejoin="round" d="M9 12H9.0001"/><Path strokeLinejoin="round" d="M6 12H6.0001"/></G>
    </Svg>
  );
};

export default KeyboardBrokenIcon;
