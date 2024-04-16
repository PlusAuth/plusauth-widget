import { addons } from '@storybook/manager-api';

import { startCase } from 'lodash-es'

import PATheme from './theme';

addons.setConfig({
  theme: PATheme,
  panelPosition: 'right',
  sidebar: {
    renderLabel: ({ name, type }) => {
      return type === 'story' ? name.replace(/^\d+\.?/, '') : startCase(name.replace(/^\d+[\.\-]?/, ''));
    },
  }
});
