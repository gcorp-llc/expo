
import React from 'react';
import Svg, { Circle, Path, G } from 'react-native-svg';
import type { StyleProp, ViewStyle } from 'react-native';

export interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const TuningSquareBrokenIcon: React.FC<IconProps> = ({
  size = 24,
  width,
  height,
  color = '#000000',
  style,
}) => {
  const iconWidth = width ?? size;
  const iconHeight = height ?? size;

  return (
    <Svg
      width={iconWidth}
      height={iconHeight}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      <G
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* First tuning control */}
        <Circle cx={8} cy={10} r={2} />

        {/* Second tuning control */}
        <Circle cx={16} cy={14} r={2} />

        {/* Vertical adjustment lines */}
        <Path d="M8 14V19" />
        <Path d="M16 10V5" />

        {/* Broken slider lines */}
        <Path d="M8 5V6" />
        <Path d="M16 19V18" />

        {/* Outer rounded square - broken style */}
        <Path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 7.94498" />
      </G>
    </Svg>
  );
};

export default TuningSquareBrokenIcon;
