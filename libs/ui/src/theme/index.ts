// 1. Import `extendTheme`
import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

import { colors } from './colors';
import { colors_imagina } from './colors/imagina';

import { components } from './components';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const breakpoints = createBreakpoints({
  xs: '480px',
  sm: '768px',
  md: '1024px',
  lg: '1440px',
  xl: '1740px',
  '2xl': '2040px',
});

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  semanticTokens: { colors: process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? colors : colors_imagina },
  breakpoints,
  components,
  config,
});

export { theme };
