import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

export interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const HelpBrokenIcon: React.FC<IconProps> = ({
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
      <G fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.5"><Circle cx="12" cy="12" r="4"/><Path d="M14.8284 9.17154L19.0724 4.92773"/><Path d="M4.92773 19.0723L9.17155 14.8286"/><Path d="M9.17157 9.17157L4.92851 4.92822"/><Path d="M19.0723 19.0723L14.8284 14.8286"/><Path d="M9.41235 2.33892C11.0533 1.89775 12.8289 1.86936 14.5882 2.34078C19.9229 3.7702 23.0887 9.25357 21.6593 14.5882C20.2299 19.9229 14.7465 23.0887 9.41185 21.6593C4.07719 20.2299 0.911364 14.7465 2.34078 9.41185C2.8122 7.65248 3.72457 6.12901 4.92711 4.92847"/></G>
    </Svg>
  );
};

export default HelpBrokenIcon;
