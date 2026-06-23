import deepmerge from 'deepmerge';

import type { IWidgetSettings } from '../src/ui/interfaces';

const defaultContext =  {
  ui_locales: [
  ],
  params: {

  },
  client: {
    clientName: 'PlusAuth',
    logoUri: 'https://static.plusauth.com/images/logo.png'
  },
  settings: {

  },
  details: {

  }
}
const defaultSettings = {
  mode: 'login',
  modeOptions: {
  }
}
export const useConfig = (settings = {} as Partial<IWidgetSettings>, context = { } as any) => {
  return {
    settings: deepmerge(defaultSettings, settings),
    context: deepmerge(defaultContext, context),
  }
}
