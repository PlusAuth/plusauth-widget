import { inject } from 'vue';

import { type Translator, translatorKey } from '../utils/translator';

export const useLocale = () => inject(translatorKey) as Translator
