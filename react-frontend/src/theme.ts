import {createTheme, rem} from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'muted-teal',
  colors: {
    'muted-teal': [
      "#f0faf8",
      "#e3f0ee",
      "#c0e2dc",
      "#9bd3ca",
      "#7ec6b9",
      "#6abfaf",
      "#5ebbaa",
      "#4ea494",
      "#419284",
      "#2f7f71"
    ]
  },
  shadows: {
    sm: '0px 0px 2px 1px rgba(0, 0, 0, .1)',
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },
  fontFamily: 'Anybody, sans-serif',
  headings: {
    fontFamily: 'Anybody, sans-serif',
    fontWeight: '600',
    sizes:{
      h1:{fontWeight: '600', fontSize: rem(64), lineHeight: '1'},
      h2:{fontWeight: '600', fontSize: rem(48), lineHeight: '1'},
      h3:{fontWeight: '600', fontSize: rem(36), lineHeight: '1'},
      h4:{fontWeight: '600', fontSize: rem(28), lineHeight: '1'},
      h5:{fontWeight: '600', fontSize: rem(24), lineHeight: '1'},
      h6:{fontWeight: '600', fontSize: rem(22), lineHeight: '1'}
    }
  },
  other:{
    cardColumnWidth: 600
  }
});