import { createMuiTheme } from '@material-ui/core';
import { esES } from '@material-ui/core/locale';

import palette from './palette';
import typography from './typography';
import overrides from './overrides';

const theme = createMuiTheme(
  {
    palette,
    typography,
    overrides,
  },
  esES
);

export type Theme = typeof theme;
export default theme;
