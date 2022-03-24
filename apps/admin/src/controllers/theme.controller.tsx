// 1. Import `extendTheme`
import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const breakpoints = createBreakpoints({
  sm: '768px',
  md: '1024px',
  lg: '1440px',
  xl: '1740px',
  '2xl': '2040px',
});

// 2. Call `extendTheme` and pass your custom values
const theme = {
  light: extendTheme({
    colors: {
      white: '#ffffff',
      black: '#10172E',
      gray_1: '#1B1F31',
      gray_3: '#84889A',
      gray_4: '#878EA0',
      gray_5: '#E6E8EE',
      gray_6: '#F4F4F8',
      gray_7: '#FAFAFC',
      primary: '#26C8AB',
      cancel: '#EC555E',
      accept: '#84E761',
    },
    breakpoints,
    config,
  }),
  dark: extendTheme({
    colors: {
      white: '#232531',
      black: '#FFFFFF',
      gray_1: '#3F404F',
      gray_3: '#797A84',
      gray_4: '#B5B7C2',
      gray_5: '#434453',
      gray_6: '#161822',
      gray_7: '#1B1F2B',
      primary: '#36F097',
      cancel: '#EC555E',
      accept: '#84E761',
    },
    breakpoints,
    config,
  }),
};

export { theme };
