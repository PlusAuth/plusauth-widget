import deepmerge from 'deepmerge';

import type { IWidgetSettings } from '../src/ui/interfaces';

const defaultContext =  {
  ui_locales: [
  ],
  client: {
    logoUri: false
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
