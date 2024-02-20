import { addons } from '@storybook/manager-api';
import PATheme from './theme';
import { startCase } from 'lodash-es'

addons.setConfig({
  theme: PATheme,
  sidebar: {
    renderLabel: ({ name, type,id }) => {
      return (type === 'story' ? name.replace(/^\d+\.?/, '') : startCase(name.replace(/^\d+[\.\-]?/, '')));
    },
  }
});
