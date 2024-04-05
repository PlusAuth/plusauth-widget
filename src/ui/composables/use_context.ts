import { inject } from 'vue';

import type { IPlusAuthContext } from '../interfaces';

export const useContext = () => inject('context') as IPlusAuthContext
