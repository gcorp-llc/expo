import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { DynamicIcon, IconProps } from '../icons';

interface IconifyProps extends IconProps {
  icon: string;
}

export const Iconify: React.FC<IconifyProps> = React.memo(({ icon, size, width, height, color, style }) => {
  return (
    <DynamicIcon
      name={icon}
      size={size}
      width={width}
      height={height}
      color={color}
      style={style}
    />
  );
});

Iconify.displayName = 'Iconify';
