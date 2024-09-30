import React from 'react';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { useTheme } from '@mui/system';
import { Theme } from '@mui/system';

interface CustomInfoIconProps extends Omit<SvgIconProps, 'fill'> {
  fill?: string | ((theme: Theme) => string);
}

const CustomInfoIcon: React.FC<CustomInfoIconProps> = (props) => {
  const { fill, ...rest } = props;
  const theme = useTheme();
  // Calculate fill color based on the provided fill
  const fillColor = typeof fill === 'function' ? fill(theme) : fill || 'white';

  return (
    <SvgIcon {...rest}>
      <circle cx="12" cy="12" r="9" fill={fillColor} />
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2" />
    </SvgIcon>
  );
};

export default CustomInfoIcon;
