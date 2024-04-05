import { inject } from 'vue';

import type { FetchWrapper } from '../utils/fetch';

export const useHttp = () => inject('http') as FetchWrapper
