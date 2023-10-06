import { ComponentOptions } from 'vue';

import { translatorKey } from '../utils/translator';

export const Translatable: ComponentOptions = {
  inject: {
    $i18n: {
      from: translatorKey
    }
  }
}
