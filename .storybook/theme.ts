import { create } from '@storybook/theming/create';
import logoFile from '../stories/assets/plusauth-md-dark.svg';
export default create({
  base: 'light',
  brandTitle: 'PlusAuth Widget',
  brandUrl: 'https://plusauth.com',
  brandImage: logoFile,
  brandTarget: '_blank',
});
