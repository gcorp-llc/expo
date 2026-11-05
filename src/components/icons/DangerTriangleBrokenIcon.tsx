
import React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import type { StyleProp, ViewStyle } from 'react-native';

export interface IconProps {
  size?: number;
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const DangerTriangleBrokenIcon: React.FC<IconProps> = ({
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
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      >
        <Path d="M6.30928 9C8.59494 5 9.96832 3 12 3C14.3107 3 15.7699 5.58716 18.6883 10.7615L19.0519 11.4063C21.4771 15.7061 22.6897 17.856 21.5937 19.428C20.4978 21 17.7864 21 12.3637 21H11.6363C6.21356 21 3.50217 21 2.40626 19.428C1.45498 18.0635 2.24306 16.2635 4.05373 13" />

        <Path d="M12 8V13" />

        <Path
          d="M12 16H12.0001"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
};

export default DangerTriangleBrokenIcon;
